'use strict';

let db = requireDb();
let underscore = require('underscore');
let userInfo = require('./../user/userInfo');
let unreadMessages = require('./util/unreadMessages');

let addHasNotReadMessages = function (threads, unreadMessagesPerType) {

    function addNumberOfUnreadMessages(thread) {
        let unreadMessagesOfThread = underscore.findWhere(unreadMessagesPerType, {
            threadId: thread.threadId
        });
        if (unreadMessagesOfThread) {
            thread.numberOfUnreadMessages = unreadMessagesOfThread.numberOfUnreadMessages;
        }
    }

    underscore.forEach(threads, function (thread) {
        thread.hasNotReadMessages = thread.lastTimeVisited < thread.lastUpdate;
        delete thread.lastTimeVisited;
        addNumberOfUnreadMessages(thread);
    });
};

let getThreads = function (params) {
    return db.cypher().match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)")
        .optionalMatch("(contact:User)-[:ACTIVE]->(thread)-[:NEXT_MESSAGE]->(message:Message)")
        .where("contact.userId <> {userId}")
        .with("user, contact, active, thread, message")
        .match("(contact)-[privacyR:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("user, contact, active, thread, message, rContact, privacyR, privacy")
        .where("(rContact IS NULL AND type(privacyR) = 'HAS_PRIVACY_NO_CONTACT') OR " +
            "(rContact.type = privacyR.type AND type(privacyR) = 'HAS_PRIVACY')")
        .return("message.text AS previewText, contact.name AS description, message.messageAdded AS lastUpdate, " +
            "active.lastTimeVisited AS lastTimeVisited, thread.threadId AS threadId, privacy.profile AS profileVisible, " +
            "privacy.image AS imageVisible, contact.userId AS userId")
        .orderBy("lastUpdate DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(params);
};

let getNumberOfThreads = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)")
        .return("COUNT(*) AS numberOfThreads")
        .end({userId: userId});
};

let getMessageThreads = function (userId, maxItems, skip) {

    let commands = [];

    commands.push(unreadMessages.getUnreadMessages(userId).getCommand());
    commands.push(getNumberOfThreads(userId).getCommand());
    commands.push(unreadMessages.getTotalNumberOfUnreadMessages(userId).getCommand());

    return getThreads({
        userId: userId,
        maxItems: maxItems,
        skip: skip
    })
        .send(commands)
        .then(function (resp) {
            addHasNotReadMessages(resp[3], resp[0]);
            userInfo.addImageForPreview(resp[3]);
            return {
                threads: resp[3],
                numberOfThreads: resp[1][0].numberOfThreads,
                totalUnreadMessages: resp[2][0].totalUnreadMessages
            };
        });
};

module.exports = {
    getMessageThreads: getMessageThreads
};
