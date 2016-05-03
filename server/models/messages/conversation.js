'use strict';

var db = require('./../../neo4j');
var underscore = require('underscore');
var exceptions = require('./../../lib/error/exceptions');
var modification = require('./../modification/modification');
var userInfo = require('./../user/userInfo');
var security = require('./util/security');
var unread = require('./util/unreadMessages');
var time = require('./../../lib/time');
var uuid = require('./../../lib/uuid');
var messageReceived = require('./../eMailService/messageReceived');
var logger = requireLogger.getLogger(__filename);

var addWriterInfo = function (userId, messages) {
    underscore.forEach(messages, function (message) {
        if (message.userId === userId) {
            message.profileVisible = true;
            message.imageVisible = true;
        }
    });
};

var getThreadInfos = function (params) {
    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:Thread {threadId: {threadId}})<-[:ACTIVE]-(contact:User)")
        .return("contact.name AS description").end(params);
};

var getNumberOfMessages = function (params) {
    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:Thread" +
            " {threadId: {threadId}})-[:NEXT_MESSAGE*]->(message:Message)")
        .return("COUNT(message) AS numberOfMessages")
        .end(params);
};

var getMessagesOfThreads = function (params, setTime) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread{threadId: {threadId}})" +
            "-[:NEXT_MESSAGE*]->(message:Message)-[:WRITTEN]->(writer:User)")
        .set('active', setTime)
        .with("user, message, writer")
        .return("message.text AS text, message.messageAdded AS timestamp, writer.userId AS userId, writer.name AS name," +
            "(writer.userId = {userId}) AS isUser")
        .orderBy("message.messageAdded DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end(params);
};

var getMessages = function (userId, threadId, itemsPerPage, skip, session, req) {

    var commands = [], now = time.getNowUtcTimestamp();

    commands.push(getThreadInfos({
        userId: userId,
        threadId: threadId
    }).getCommand());
    commands.push(getNumberOfMessages({userId: userId, threadId: threadId}).getCommand());
    commands.push(getMessagesOfThreads({
        userId: userId,
        threadId: threadId,
        skip: skip,
        limit: itemsPerPage
    }, {lastTimeVisited: now}).getCommand());

    return unread.getTotalNumberOfUnreadMessages(userId).send(commands)
        .then(function (resp) {
            if (resp[0][0] && resp[0][0].description) {
                addWriterInfo(userId, resp[2]);
                userInfo.addImageForPreview(resp[2]);
                modification.resetModificationForThread(threadId, session);
                return {
                    messages: resp[2],
                    threadDescription: resp[0][0].description,
                    numberOfMessages: resp[1][0].numberOfMessages,
                    totalUnreadMessages: resp[3][0].totalUnreadMessages
                };
            }
            return exceptions.getInvalidOperation('User ' + userId + ' tried to access not participating thread ' + threadId, logger, req);
        });
};

var startEmailJobForReceivingUser = function (userId, threadId) {
    return db.cypher().match("(user:User)-[active:ACTIVE]->(thread:Thread {threadId: {threadId}})")
        .where("user.userId <> {userId}")
        .return("user.userId AS receivedUserId")
        .end({userId: userId, threadId: threadId}).send().then(function (resp) {
            if (resp.length === 1) {
                messageReceived.received(resp[0].receivedUserId);
            }
        });
};

var addMessageToThread = function (userId, threadId, text, session, req) {

    return security.checkAllowedToAddMessage(userId, threadId, req)
        .then(function () {
            var now = time.getNowUtcTimestamp();
            return db.cypher()
                .match("(user:User {userId: {userId}})-[:ACTIVE]->(thread:Thread " +
                    "{threadId: {threadId}})-[:NEXT_MESSAGE]->(messagePrevious:Message)")
                .create("(thread)-[:NEXT_MESSAGE]->(newMessage:Message {messageAdded: {now}, text: {text}})-[:NEXT_MESSAGE]->(messagePrevious)," +
                    "(newMessage)-[:WRITTEN]->(user)")
                .with("thread, messagePrevious, user, newMessage")
                .match('(thread)-[r:NEXT_MESSAGE]->(messagePrevious)')
                .delete('r')
                .with("thread, messagePrevious, user, newMessage")
                .return("user.userId AS userId, user.name AS name, newMessage.text AS text, newMessage.messageAdded AS timestamp")
                .end({
                    userId: userId,
                    threadId: threadId,
                    text: text,
                    now: now
                }).send()
                .then(function (resp) {
                    startEmailJobForReceivingUser(userId, threadId);
                    return {message: resp[0]};
                });
        });
};

var messageThreadExists = function (userId, contactId) {
    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:Thread)<-[:ACTIVE]-(:User {userId: {contactId}})")
        .return("thread.threadId AS threadId")
        .end({userId: userId, contactId: contactId}).send()
        .then(function (resp) {
            if (resp.length > 0) {
                return resp[0].threadId;
            }
        });
};

var addMessageToUser = function (userId, contactId, text, session, req) {
    return messageThreadExists(userId, contactId)
        .then(function (threadId) {
            if (threadId) {
                return addMessageToThread(userId, threadId, text, session, req)
                    .then(function (resp) {
                        resp.message.threadId = threadId;
                        return resp;
                    });
            }
            return security.checkAllowedToCreateThread(userId, contactId, req)
                .then(function () {
                    var now = time.getNowUtcTimestamp(), threadId = uuid.generateUUID();
                    return db.cypher()
                        .match("(user:User {userId: {userId}}), (contact:User {userId: {contactId}})")
                        .createUnique("(user)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread:Thread {threadId: {threadId}})" +
                            "<-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]-(contact)")
                        .with("user, thread, contact")
                        .createUnique("(thread)-[:NEXT_MESSAGE]->(message:Message {text: {text}, messageAdded: {lastTimeVisited}})-[:WRITTEN]->(user)")
                        .return("thread.threadId AS threadId, user.name AS name, message.text AS text, message.messageAdded AS timestamp")
                        .end({
                            userId: userId,
                            contactId: contactId,
                            lastTimeVisited: now,
                            lastTimeVisited2: now - 1,
                            text: text,
                            threadId: threadId
                        }).send()
                        .then(function (resp) {
                            startEmailJobForReceivingUser(userId, threadId);
                            return {message: resp[0]};
                        });
                });
        });
};

module.exports = {
    getMessages: getMessages,
    addMessageToThread: addMessageToThread,
    addMessageToUser: addMessageToUser
};
