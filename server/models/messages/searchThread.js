'use strict';

var db = require('./../../neo4j');
var userInfo = require('./../user/userInfo');

var getPrivacyString = function (withCondition) {
    return db.cypher()
        .with('user2, user' + withCondition)
        .match("(user2)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)<-[rContact:IS_CONTACT]-(user2)")
        .with("user2, rContact, user, v, vr" + withCondition)
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .getCommandString();
};

var searchQuery = function (userId, query, maxItems, isSuggestion) {
    var queryRegEx = '(?i).*'.concat(query, '.*'), returnThread, returnContact, returnUser;


    if (!isSuggestion) {
        returnThread = "thread.threadId AS threadId, user2.name AS description, contact.type AS type, message.messageAdded AS lastUpdate, " +
            "user2.userId AS userId, v.profile AS profileVisible, v.image AS imageVisible, message.text AS previewText";
        returnContact = "null AS threadId, user2.name AS description, contact.type AS type, null AS lastUpdate, " +
            "user2.userId AS userId, v.profile AS profileVisible, v.image AS imageVisible, null AS previewText";
        returnUser = "null AS threadId, user2.name AS description, null AS type, null AS lastUpdate, " +
            "user2.userId AS userId, v.profile AS profileVisible, v.image AS imageVisible, null AS previewText";
    } else {
        returnThread = "user2.name AS description";
        returnContact = returnThread;
        returnUser = returnThread;
    }

    return db.cypher()
        .match("(user:User {userId: {userId}})-[:ACTIVE]->(thread:Thread)<-[:ACTIVE]-(user2:User), (thread)-[:NEXT_MESSAGE]->(message:Message)")
        .where("user2.name =~ {queryRegEx}")
        .optionalMatch("(user)-[contact:IS_CONTACT]->(user2)")
        .addCommand(getPrivacyString(',thread, message, contact'))
        .return(returnThread)
        .orderBy("user2.name")
        .limit("{maxItems}")
        .unionAll()
        .match("(user:User {userId: {userId}})-[contact:IS_CONTACT]->(user2:User)")
        .where("user2.name =~ {queryRegEx} AND NOT (user)-[:ACTIVE]->(:Thread)<-[:ACTIVE]-(user2)")
        .addCommand(getPrivacyString(',contact'))
        .return(returnContact)
        .orderBy("user2.name")
        .limit("{maxItems}")
        .unionAll()
        .match("(user2:User), (user:User {userId: {userId}})")
        .where("user2.name =~ {queryRegEx} AND user2.userId <> {userId} AND NOT (user)-[:ACTIVE]->(:Thread)<-[:ACTIVE]-(user2) " +
            "AND NOT (user)-[:IS_CONTACT]->(user2)")
        .addCommand(getPrivacyString(''))
        .return(returnUser)
        .orderBy("user2.name ")
        .limit("{maxItems}")
        .end({userId: userId, queryRegEx: queryRegEx, maxItems: maxItems});
};

var searchThreads = function (userId, search, maxItems, isSuggestion) {

    return searchQuery(userId, search, maxItems, isSuggestion)
        .send()
        .then(function (resp) {
            if (!isSuggestion) {
                userInfo.addImageForPreview(resp);
                return {threads: resp};
            }
            return resp;
        });
};

var searchSingleThread = function (userId, conversationUserId) {

    return db.cypher()
        .match("(:User {userId: {userId}})-[:ACTIVE]->(thread:Thread)<-[:ACTIVE]-(:User {userId: {conversationUserId}})")
        .return("thread.threadId as threadId")
        .end({userId: userId, conversationUserId: conversationUserId})
        .send()
        .then(function (resp) {
            if (resp.length > 0) {
                return {hasExistingThread: true, threadId: resp[0].threadId};
            }
            return {hasExistingThread: false};
        });
};


module.exports = {
    searchThreads: searchThreads,
    searchSingleThread: searchSingleThread
};
