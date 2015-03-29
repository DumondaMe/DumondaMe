'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var modification = require('./../modification/modification');
var userInfo = require('./../user/userInfo');
var threadCondition = require('./util/threadCondition');
var security = require('./util/security');
var time = require('./../../../common/src/lib/time');
var logger = requireLogger.getLogger(__filename);

var addWriterInfo = function (userId, messages) {
    underscore.forEach(messages, function (message) {
        if (message.id === userId) {
            message.profileVisible = true;
            message.imageVisible = true;
        }
    });
};

var getThreadInfos = function (params, isGroupThread) {
    var threadInfo;
    if (isGroupThread) {
        threadInfo = db.cypher()
            .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:GroupThread {threadId: {threadId}})")
            .return("thread.description AS description, HEAD(LABELS(thread)) AS threadType");
    } else {
        threadInfo = db.cypher()
            .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:Thread {threadId: {threadId}})<-[:ACTIVE]-(contact:User)")
            .return("contact.name AS description, HEAD(LABELS(thread)) AS threadType");
    }
    return threadInfo.end(params);
};

var getNumberOfMessages = function (params, isGroupThread) {
    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(" + threadCondition.getThreadCondition(isGroupThread) + " {threadId: {threadId}})-[:NEXT_MESSAGE*]->(message:Message)")
        .return("COUNT(message) AS numberOfMessages")
        .end(params);
};

var getMessagesOfThreads = function (params, setTime, isGroupThread) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(" + threadCondition.getThreadCondition(isGroupThread) + " {threadId: {threadId}})" +
        "-[:NEXT_MESSAGE*]->(message:Message)-[:WRITTEN]->(writer:User)")
        .set('active', setTime)
        .with("user, message, writer")
        .optionalMatch("(writer)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .where('writer.userId <> user.userId')
        .with("user, message, writer, vr, v")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(writer)")
        .where('writer.userId <> user.userId')
        .with("user, message, writer, vr, v, rContact")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY') OR " +
        "writer.userId = user.userId")
        .return("message.text AS text, message.messageAdded AS timestamp, writer.userId AS id, writer.name AS name," +
        "v.profile AS profileVisible, v.image AS imageVisible")
        .orderBy("message.messageAdded DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end(params);
};

var getMessages = function (userId, threadId, itemsPerPage, skip, isGroupThread, session) {

    var commands = [], now = time.getNowUtcTimestamp();

    commands.push(getThreadInfos({
        userId: userId,
        threadId: threadId
    }, isGroupThread).getCommand());
    commands.push(getNumberOfMessages({userId: userId, threadId: threadId}, isGroupThread).getCommand());

    return getMessagesOfThreads({
        userId: userId,
        threadId: threadId,
        skip: skip,
        limit: itemsPerPage,
        lastTimeVisited: now
    }, {lastTimeVisited: now}, isGroupThread)
        .send(commands)
        .then(function (resp) {
            if (resp[0][0] && resp[0][0].description && resp[0][0].threadType) {
                addWriterInfo(userId, resp[2]);
                userInfo.addImageForPreview(resp[2], session.cookie._expires);
                modification.resetModificationForThread(threadId, isGroupThread, session);
                return {
                    messages: resp[2],
                    threadDescription: resp[0][0].description,
                    isGroupThread: resp[0][0].threadType === 'GroupThread',
                    numberOfMessages: resp[1][0].numberOfMessages
                };
            }
            return exceptions.getInvalidOperation('User ' + userId + ' tried to access not participating thread ' + threadId, logger);
        });
};

var addMessage = function (userId, threadId, text, isGroupThread, session) {

    return security.checkAllowedToAddMessage(userId, threadId, isGroupThread)
        .then(function () {
            var now = time.getNowUtcTimestamp();
            return db.cypher()
                .match("(user:User {userId: {userId}})-[active:ACTIVE]->(" + threadCondition.getThreadCondition(isGroupThread) + "{threadId: {threadId}})" +
                "-[:NEXT_MESSAGE]->(messagePrevious:Message)")
                .create("(thread)-[:NEXT_MESSAGE]->(newMessage:Message {messageAdded: {now}, text: {text}})-[:NEXT_MESSAGE]->(messagePrevious)," +
                "(newMessage)-[:WRITTEN]->(user)")
                .with("thread, messagePrevious, user, newMessage, active")
                .match('(thread)-[r:NEXT_MESSAGE]->(messagePrevious)')
                .delete('r')
                .with("thread, messagePrevious, user, newMessage, active")
                .set('active', {lastTimeVisited: now})
                .with("thread, messagePrevious, user, newMessage")
                .return("user.userId AS id, user.name AS name, newMessage.text AS text, newMessage.messageAdded AS timestamp, " +
                "true AS profileVisible, true AS imageVisible")
                .end({
                    userId: userId,
                    threadId: threadId,
                    text: text,
                    now: now,
                    lastTimeVisited: now
                }).send()
                .then(function (resp) {
                    userInfo.addImageForPreview(resp, session.cookie._expires);
                    modification.resetModificationForThread(resp[0].threadId, isGroupThread, session);
                    return {message: resp[0]};
                });
        });
};

module.exports = {
    getMessages: getMessages,
    addMessage: addMessage
};
