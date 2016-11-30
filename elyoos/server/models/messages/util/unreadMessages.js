"use strict";

var db = requireDb();

var getUnreadMessages = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)-[:NEXT_MESSAGE*0..20]->(message:Message)" +
            "-[:WRITTEN]->(userWritten:User)")
        .where("active.lastTimeVisited < message.messageAdded AND userWritten.userId <> {userId}")
        .with("user, thread, COUNT(thread.threadId) AS numberOfUnreadMessages")
        .orderBy("numberOfUnreadMessages DESC")
        .match("(user)-[:ACTIVE]->(thread)<-[:ACTIVE]-(contact:User), (thread)-[:NEXT_MESSAGE]->(message:Message)")
        .with("contact, user, thread, numberOfUnreadMessages, message")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(contact)")
        .with("contact, thread, numberOfUnreadMessages, message, rContact, v, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("numberOfUnreadMessages, thread.threadId AS threadId, contact.name AS description, contact.userId AS userId, " +
            "message.text AS previewText, message.messageAdded AS lastUpdate, v.profile AS profileVisible, v.image AS imageVisible")
        .end({userId: userId});
};

var getTotalNumberOfUnreadMessages = function (userId) {
    return db.cypher()
        .match("(user:User {userId: {userId}})-[active:ACTIVE]->(thread:Thread)-[:NEXT_MESSAGE*0..20]->(message:Message)" +
            "-[:WRITTEN]->(userWritten:User)")
        .where("active.lastTimeVisited < message.messageAdded AND userWritten.userId <> {userId}")
        .return("COUNT(*) AS totalUnreadMessages")
        .end({userId: userId});
};

module.exports = {
    getUnreadMessages: getUnreadMessages,
    getTotalNumberOfUnreadMessages: getTotalNumberOfUnreadMessages
};
