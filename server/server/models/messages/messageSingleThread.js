'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var addWriterInfo = function (userId, messages) {
    underscore.forEach(messages, function (message) {
        message.writtenByMe = message.writerUserId === userId;
        delete message.writerUserId;
    });
};

var getThreadContactName = function (params) {
    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(:Thread {threadId: {threadId}})<-[:ACTIVE]-(contact:User)")
        .return("contact.name AS name")
        .end(params);
};

var getMessagesOfThreads = function (params) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread {threadId: {threadId}})" +
        "-[:NEXT_MESSAGE*]->(message:Message)-[:WRITTEN]->(writer:User)")
        .return("message.text AS text, message.messageAdded AS timestamp, writer.userId AS writerUserId")
        .orderBy("message.messageAdded DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end(params);
};

var getMessages = function (userId, threadId, itemsPerPage, skip) {

    var commands = [];

    commands.push(getThreadContactName({
        userId: userId,
        threadId: threadId
    }).getCommand());

    return getMessagesOfThreads({
        userId: userId,
        threadId: threadId,
        skip: skip,
        limit: itemsPerPage
    })
        .send(commands)
        .then(function (resp) {
            if (resp[0][0] && resp[0][0].name) {
                addWriterInfo(userId, resp[1]);
                return {
                    messages: resp[1],
                    contactName: resp[0][0].name
                };
            }
            var invalidOperationException = new exceptions.invalidOperation('User ' + userId + ' tried to access not participating thread ' + threadId);
            logger.warn(invalidOperationException.message, {error: ''});
            return Promise.reject(invalidOperationException);
        });
};


module.exports = {
    getMessages: getMessages
};
