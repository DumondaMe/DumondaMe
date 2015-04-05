"use strict";

var db = require('./../../../neo4j');

var getNumberOfUnreadMessages = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread)-[:NEXT_MESSAGE*0..100]->(message:Message)")
        .where("active.lastTimeVisited < message.messageAdded AND (thread:Thread OR thread:GroupThread)")
        .return("COUNT(thread.threadId) AS unreadMessage, thread.threadId AS threadId, " +
        "EXISTS((user)-[active]->(thread:GroupThread)) AS isGroupThread")
        .orderBy("unreadMessage DESC")
        .end({userId: userId});
};

var hasUnreadMessages = function (userId) {
    return getNumberOfUnreadMessages(userId).send()
        .then(function (resp) {
            return resp;
        });
};

module.exports = {
    hasUnreadMessages: hasUnreadMessages,
    getNumberOfUnreadMessages: getNumberOfUnreadMessages
};
