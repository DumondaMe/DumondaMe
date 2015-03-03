'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);
var userInfo = require('./../user/userInfo');

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

var getNumberOfUnreadMessages = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread)-[:NEXT_MESSAGE*0..100]->(message:Message)")
        .where("active.lastTimeVisited < message.messageAdded AND (thread:Thread OR thread:GroupThread)")
        .return("COUNT(thread.threadId) AS unreadMessage, thread.threadId AS threadId, EXISTS((user)-[active]->(thread:GroupThread)) AS isGroupThread")
        .orderBy("unreadMessage DESC")
        .end({userId: userId});
};

var getNumberOfThreads = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread)")
        .where("thread:Thread OR thread:GroupThread")
        .return("COUNT(thread.threadId) AS numberOfThreads")
        .end({userId: userId});
};

var hasUnreadMessages = function (userId) {
    return getNumberOfUnreadMessages(userId).send()
        .then(function (resp) {
            return resp;
        });
};

var getAllThreads = function (params) {
    var cypher = db.cypher();
    cypher = getThreads(cypher).unionAll();
    return getGroupThreads(cypher)
        .end(params);
};

var getMessageThreads = function (userId, itemsPerPage, skip, expires) {

    var commands = [];

    commands.push(getNumberOfUnreadMessages(userId).getCommand());
    commands.push(getNumberOfThreads(userId).getCommand());

    return getAllThreads({
        userId: userId
    })
        .send(commands)
        .then(function (resp) {
            resp[2] = resp[2].slice(skip, skip + itemsPerPage);
            addHasNotReadMessages(resp[2], resp[0]);
            userInfo.addImageForPreview(resp[2], expires);
            return {
                threads: resp[2].sort(compare),
                numberOfThreads: resp[1][0].numberOfThreads,
                numberOfUnreadMessages: totalUnreadMessages(resp[0])
            };
        });
};


module.exports = {
    getMessageThreads: getMessageThreads,
    hasUnreadMessages: hasUnreadMessages
};
