'use strict';

var db = require('./../../../neo4j/index');
var exceptions = require('./../../../lib/error/exceptions');
var time = require('./../../../lib/time');
var threadCondition = require('./threadCondition');
var logger = requireLogger.getLogger(__filename);

var checkAllowedToAddMessage = function (userId, threadId, isGroupThread, req) {

    function checkNumberOfAllowedMessagesPerHour(resp) {
        return resp[0][0].count > 1000;
    }

    function checkUserHasAccessToThread(resp, isGroup) {
        if (isGroup) {
            return !resp[1][0];
        }
        return !resp[2][0];
    }

    function checkUserIsBlocked(resp, isGroup) {
        if (isGroup) {
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
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(" + threadCondition.getThreadCondition(isGroupThread) + " {threadId: {threadId}})")
        .return("user.userId AS userId")
        .end(params).send(commands)
        .then(function (resp) {
            if (checkNumberOfAllowedMessagesPerHour(resp)) {
                return exceptions.getInvalidOperation('User has send more than 1000 messages per hour', logger, req);
            }
            if (checkUserHasAccessToThread(resp, isGroupThread)) {
                return exceptions.getInvalidOperation('User tried to access not participating thread ' + threadId, logger, req);
            }
            if (checkUserIsBlocked(resp, isGroupThread)) {
                return exceptions.getInvalidOperation('User is blocked for thread ' + threadId, logger, req);
            }
        });
};

var checkAllowedToCreateThread = function (userId, contactId, req) {

    function checkUserIsBlocked(resp) {
        return resp.length > 0;
    }

    return db.cypher()
        .match("(user:User {userId: {userId}}), (contact:User {userId: {contactId}})")
        .with("user, contact")
        .match("(user)<-[:IS_BLOCKED]-(contact)")
        .return("true AS blocked")
        .end({userId: userId, contactId: contactId}).send()
        .then(function (resp) {
            if (checkUserIsBlocked(resp)) {
                return exceptions.getInvalidOperation('User is blocked to create Message Chat with ' + contactId, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToAddMessage: checkAllowedToAddMessage,
    checkAllowedToCreateThread: checkAllowedToCreateThread
};
