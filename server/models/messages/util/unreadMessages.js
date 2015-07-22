"use strict";

var db = require('./../../../neo4j');

var getUnreadMessages = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)-[:NEXT_MESSAGE*0..20]->(message:Message)")
        .where("active.lastTimeVisited < message.messageAdded")
        .with("user, thread, COUNT(thread.threadId) AS numberOfUnreadMessages")
        .orderBy("numberOfUnreadMessages DESC")
        .match("(user)-[:ACTIVE]->(thread)<-[:ACTIVE]-(contact:User)")
        .with("contact, thread, numberOfUnreadMessages")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, thread, numberOfUnreadMessages, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("numberOfUnreadMessages, thread.threadId AS threadId, contact.name AS name, contact.userId AS userId, " +
        "v.profile AS profileVisible, v.image AS imageVisible, false AS isGroupThread")
        .unionAll()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:GroupThread)-[:NEXT_MESSAGE*0..20]->(message:Message)")
        .where("active.lastTimeVisited < message.messageAdded")
        .with("user, thread, COUNT(thread.threadId) AS numberOfUnreadMessages")
        .return("numberOfUnreadMessages, thread.threadId AS threadId, thread.description AS name, 0 AS userId," +
        "false AS profileVisible, false AS imageVisible, true AS isGroupThread")
        .end({userId: userId});
};

module.exports = {
    getUnreadMessages: getUnreadMessages
};
