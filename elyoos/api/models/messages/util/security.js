'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let time = require('elyoos-server-lib').time;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getNummberOfMessageCommand = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(thread)-[:NEXT_MESSAGE*]->(message:Message)-[:WRITTEN]->(user)")
        .where("(thread:Thread) AND message.messageAdded > {timeFrame}")
        .return("count(*) AS numberOfMessage")
        .end({
            userId: userId,
            timeFrame: time.getNowUtcTimestamp() - 3600
        }).getCommand();
};

let checkAllowedToAddMessage = function (userId, threadId, req) {

    function checkNumberOfAllowedMessagesPerHour(resp) {
        return resp[0][0].count > 1000;
    }

    function checkUserHasAccessToThread(resp) {
        return !resp[2][0];
    }

    function checkUserIsBlocked(resp) {
        return resp[1][0];
    }

    let commands = [], params = {
        userId: userId,
        threadId: threadId
    };

    commands.push(getNummberOfMessageCommand(userId));

    commands.push(db.cypher()
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(:Thread {threadId: {threadId}})<-[:ACTIVE]-(contact:User)")
        .with("user, contact")
        .match("(user)<-[:IS_BLOCKED]-(contact)")
        .return("true AS blocked")
        .end(params).getCommand());

    return db.cypher()
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(thread:Thread {threadId: {threadId}})")
        .return("user.userId AS userId")
        .end(params).send(commands)
        .then(function (resp) {
            if (checkNumberOfAllowedMessagesPerHour(resp)) {
                return exceptions.getInvalidOperation('User has send more than 1000 messages per hour', logger, req);
            }
            if (checkUserHasAccessToThread(resp)) {
                return exceptions.getInvalidOperation('User tried to access not participating thread ' + threadId, logger, req);
            }
            if (checkUserIsBlocked(resp)) {
                return exceptions.getInvalidOperation('User is blocked for thread ' + threadId, logger, req);
            }
        });
};

let checkAllowedToCreateThread = function (userId, contactId, req) {

    function checkNumberOfAllowedMessagesPerHour(resp) {
        return resp[0][0].count > 1000;
    }

    function checkUserIsBlocked(resp) {
        return resp[1][0];
    }

    let commands = [];

    commands.push(getNummberOfMessageCommand(userId));

    return db.cypher()
        .match("(user:User {userId: {userId}}), (contact:User {userId: {contactId}})")
        .with("user, contact")
        .match("(user)<-[:IS_BLOCKED]-(contact)")
        .return("true AS blocked")
        .end({userId: userId, contactId: contactId}).send(commands)
        .then(function (resp) {
            if (checkNumberOfAllowedMessagesPerHour(resp)) {
                return exceptions.getInvalidOperation('User has send more than 1000 messages per hour', logger, req);
            }
            if (checkUserIsBlocked(resp)) {
                return exceptions.getInvalidOperation('User is blocked to create Message Chat with ' + contactId, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToAddMessage: checkAllowedToAddMessage,
    checkAllowedToCreateThread: checkAllowedToCreateThread
};
