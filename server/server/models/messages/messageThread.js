'use strict';

var db = require('./../../neo4j');
var Promise = require('bluebird').Promise;
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);
var userInfo = require('./../user/userInfo');

function compare(a, b) {
    return b.lastUpdate - a.lastUpdate;
}

var addHasNotReadMessages = function (threads) {
    underscore.forEach(threads, function (thread) {
        thread.hasNotReadMessages = thread.lastTimeVisited < thread.lastUpdate;
        delete thread.lastTimeVisited;
    });
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

var getNumberOfUnreadGroupMessages = function (userId) {
    return db.cypher()
        .match("p=(user:User {userId: {userId}})-[active:ACTIVE]->(thread:GroupThread)-[:NEXT_MESSAGE*0..100]->(message:Message)")
        .where("active.lastTimeVisited < message.messageAdded")
        .return("COUNT(p) AS unreadMessage")
        .end({userId: userId});
};

var getNumberOfUnreadMessages = function (userId) {
    return db.cypher()
        .match("p=(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)-[:NEXT_MESSAGE*0..100]->(message:Message)")
        .where("active.lastTimeVisited < message.messageAdded")
        .return("COUNT(p) AS unreadMessage")
        .end({userId: userId});
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
    commands.push(getNumberOfUnreadGroupMessages(userId).getCommand());

    return getAllThreads({
        userId: userId
    })
        .send(commands)
        .then(function (resp) {
            resp[2] = resp[2].slice(skip, skip + itemsPerPage);
            addHasNotReadMessages(resp[2]);
            userInfo.addImageForPreview(resp[2], expires);
            return {
                threads: resp[2].sort(compare),
                numberOfUnreadMessages: resp[0][0].unreadMessage + resp[1][0].unreadMessage
            };
        });
};


module.exports = {
    getMessageThreads: getMessageThreads
};
