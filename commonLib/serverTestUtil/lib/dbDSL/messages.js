'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createThread = function (threadId, users) {

    users.forEach(function (user) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(user:User {userId: {userId}})")
            .merge("(thread:Thread {threadId: {threadId}})")
            .createUnique("(user)-[:ACTIVE {lastTimeVisited: {lastTimeVisited}}]->(thread)").end({
                threadId: threadId, userId: user.userId, lastTimeVisited: user.lastTimeVisited
            }).getCommand());
    });
};

let createMessages = function (threadId, messages) {

    dbConnectionHandling.getCommands().push(db.cypher().match("(thread:Thread {threadId: {threadId}}), (writer:User {userId: {userId}})")
        .createUnique("(thread)-[:NEXT_MESSAGE]->(:Message {text: {text}, messageAdded: {messageAdded}})-[:WRITTEN]->(writer)").end({
            threadId: threadId, userId: messages[0].userId, text: messages[0].text, messageAdded: messages[0].messageAdded
        }).getCommand());

    for(let i= 1; i < messages.length; i++) {
        let message = messages[i];
        dbConnectionHandling.getCommands().push(db.cypher().match("(thread:Thread {threadId: {threadId}})-[:NEXT_MESSAGE*]->(message:Message), (writer:User {userId: {userId}})")
            .where("NOT (message)-[:NEXT_MESSAGE]->(:Message)")
            .createUnique("(message)-[:NEXT_MESSAGE]->(:Message {text: {text}, messageAdded: {messageAdded}})-[:WRITTEN]->(writer)").end({
                threadId: threadId, userId: message.userId, text: message.text, messageAdded: message.messageAdded
            }).getCommand());
    }
};

module.exports = {
    createThread: createThread,
    createMessages: createMessages
};