'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var userInfo = require('./../user/userInfo');
var modification = require('./../modification/modification');
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

var getThreadCondition = function (isGroupThread) {
    var threadTyp;
    if (isGroupThread) {
        threadTyp = 'thread:GroupThread';
    } else {
        threadTyp = 'thread:Thread';
    }
    return threadTyp;
};

var getMessagesOfThreads = function (params, setTime, isGroupThread) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(" + getThreadCondition(isGroupThread) + " {threadId: {threadId}})" +
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
                addWriterInfo(userId, resp[1]);
                userInfo.addImageForPreview(resp[1], session.cookie._expires);
                modification.resetModificationForThread(resp[0].threadId, isGroupThread, session);
                return {
                    messages: resp[1],
                    threadDescription: resp[0][0].description,
                    isGroupThread: resp[0][0].threadType === 'GroupThread'
                };
            }
            return exceptions.getInvalidOperation('User ' + userId + ' tried to access not participating thread ' + threadId, logger);
        });
};

var checkAllowedToAddMessage = function (userId, threadId, isGroupThread) {

    function checkNumberOfAllowedMessagesPerHour(resp) {
        return resp[0][0].count > 1000;
    }

    function checkUserHasAccessToThread(resp, isGroupThread) {
        if (isGroupThread) {
            return !resp[1][0];
        }
        return !resp[2][0];
    }

    function checkUserIsBlocked(resp, isGroupThread) {
        if (isGroupThread) {
            return false;
        }
        return resp[1][0];
    }

    var commands = [], params = {
        userId: userId,
        threadId: threadId
    };

    commands.push(db.cypher()
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(thread)-[:NEXT_MESSAGE*]->(message:Message)-[:WRITTEN]->(user)")
        .where("(thread:Thread OR thread:GroupThread) AND message.messageAdded > {timeFrame}")
        .return("count(*) AS numberOfMessage")
        .end({
            userId: userId,
            timeFrame: time.getNowUtcTimestamp() - 3600
        }).getCommand());

    if (!isGroupThread) {
        commands.push(db.cypher()
            .match("(user:User {userId: {userId}})-[:ACTIVE]->(:Thread {threadId: {threadId}})<-[:ACTIVE]-(contact:User)")
            .with("user, contact")
            .match("(user)<-[:IS_BLOCKED]-(contact)")
            .return("true AS blocked")
            .end(params).getCommand());
    }

    return db.cypher()
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(" + getThreadCondition(isGroupThread) + " {threadId: {threadId}})")
        .return("user.userId AS userId")
        .end(params).send(commands)
        .then(function (resp) {
            if (checkNumberOfAllowedMessagesPerHour(resp)) {
                return exceptions.getInvalidOperation('User ' + userId + ' has send more than 1000 messages per hour', logger);
            }
            if (checkUserHasAccessToThread(resp, isGroupThread)) {
                return exceptions.getInvalidOperation('User ' + userId + ' tried to access not participating thread ' + threadId, logger);
            }
            if (checkUserIsBlocked(resp, isGroupThread)) {
                return exceptions.getInvalidOperation('User ' + userId + ' is blocked for thread ' + threadId, logger);
            }
        });
};

var addMessage = function (userId, threadId, text, isGroupThread, session) {

    return checkAllowedToAddMessage(userId, threadId, isGroupThread)
        .then(function () {
            var now = time.getNowUtcTimestamp();
            return db.cypher()
                .match("(user:User {userId: {userId}})-[active:ACTIVE]->(" + getThreadCondition(isGroupThread) + "{threadId: {threadId}})" +
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
