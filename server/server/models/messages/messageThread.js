'use strict';

var db = require('./../../neo4j');
var uuid = require('./../../../common/src/lib/uuid');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);
var userInfo = require('./../user/userInfo');
var unreadMessages = require('./util/unreadMessages');
var time = require('./../../../common/src/lib/time');
var security = require('./util/security');
var conversation = require('./conversation');

function compare(a, b) {
    return b.lastUpdate - a.lastUpdate;
}

var addHasNotReadMessages = function (threads, unreadMessagesPerType) {

    function addNumberOfUnreadMessages(thread) {
        var unreadMessages = underscore.findWhere(unreadMessagesPerType, {
            threadId: thread.threadId,
            isGroupThread: thread.isGroupThread
        });
        if (unreadMessages) {
            thread.numberOfUnreadMessages = unreadMessages.unreadMessage;
        }
    }

    underscore.forEach(threads, function (thread) {
        thread.hasNotReadMessages = thread.lastTimeVisited < thread.lastUpdate;
        delete thread.lastTimeVisited;
        addNumberOfUnreadMessages(thread);
    });
};

var totalUnreadMessages = function (messageInfos) {
    var total = 0;
    underscore.forEach(messageInfos, function (messageInfo) {
        total += messageInfo.unreadMessage;
    });
    return total;
};

var getThreads = function (cypher) {
    return cypher.match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)")
        .optionalMatch("(contact:User)-[:ACTIVE]->(thread)-[:NEXT_MESSAGE]->(message:Message)")
        .where("contact.userId <> {userId}")
        .with("user, contact, active, thread, message")
        .match("(contact)-[privacyR:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("user, contact, active, thread, message, rContact, privacyR, privacy")
        .where("(rContact IS NULL AND type(privacyR) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = privacyR.type AND type(privacyR) = 'HAS_PRIVACY')")
        .return("message.text AS previewText, contact.name AS description, message.messageAdded AS lastUpdate, " +
        "active.lastTimeVisited AS lastTimeVisited, thread.threadId AS threadId, privacy.profile AS profileVisible, " +
        "privacy.image AS imageVisible, contact.userId AS id, false AS isGroupThread");
};

var getGroupThreads = function (cypher) {
    return cypher.match("(:User {userId: {userId}})-[active:ACTIVE]->(thread:GroupThread)")
        .optionalMatch("(thread)-[:NEXT_MESSAGE]->(message:Message)")
        .return("message.text AS previewText, thread.description AS description, message.messageAdded AS lastUpdate, " +
        "active.lastTimeVisited AS lastTimeVisited, thread.threadId AS threadId, null AS profileVisible, null AS imageVisible, null AS id, true AS isGroupThread");
};

var getNumberOfThreads = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread)")
        .where("thread:Thread OR thread:GroupThread")
        .return("COUNT(thread.threadId) AS numberOfThreads")
        .end({userId: userId});
};

var getAllThreads = function (params) {
    var cypher = db.cypher();
    cypher = getThreads(cypher).unionAll();
    return getGroupThreads(cypher)
        .end(params);
};

var getMessageThreads = function (userId, itemsPerPage, skip) {

    var commands = [];

    commands.push(unreadMessages.getNumberOfUnreadMessages(userId).getCommand());
    commands.push(getNumberOfThreads(userId).getCommand());

    return getAllThreads({
        userId: userId
    })
        .send(commands)
        .then(function (resp) {
            resp[2] = resp[2].slice(skip, skip + itemsPerPage);
            addHasNotReadMessages(resp[2], resp[0]);
            userInfo.addImageForPreview(resp[2]);
            return {
                threads: resp[2].sort(compare),
                numberOfThreads: resp[1][0].numberOfThreads,
                numberOfUnreadMessages: totalUnreadMessages(resp[0])
            };
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

var createSingleThread = function (userId, contactId, text, session) {
    return messageThreadExists(userId, contactId)
        .then(function (threadId) {
            if (threadId) {
                return conversation.addMessage(userId, threadId, text, false, session)
                    .then(function () {
                        return {threadId: threadId};
                    });
            }
            return security.checkAllowedToCreateThread(userId, contactId)
                .then(function () {
                    var now = time.getNowUtcTimestamp();
                    return db.cypher()
                        .match("(user:User {userId: {userId}}), (contact:User {userId: {contactId}})")
                        .createUnique("(user)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread:Thread {threadId: {threadId}})" +
                        "<-[:ACTIVE {lastTimeVisited: {lastTimeVisited2}}]-(contact)")
                        .with("user, thread, contact")
                        .createUnique("(thread)-[:NEXT_MESSAGE]->(:Message {text: {text}, messageAdded: {lastTimeVisited}})-[:WRITTEN]->(user)")
                        .return("thread.threadId AS threadId")
                        .end({
                            userId: userId,
                            contactId: contactId,
                            lastTimeVisited: now,
                            lastTimeVisited2: now - 1,
                            text: text,
                            threadId: uuid.generateUUID()
                        }).send()
                        .then(function (resp) {
                            return resp[0];
                        });
                });
        });
};

module.exports = {
    getMessageThreads: getMessageThreads,
    createSingleThread: createSingleThread
};
