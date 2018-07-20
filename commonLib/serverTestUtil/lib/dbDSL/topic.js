'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createTopic = function (name) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(:Topic {name: {name}})`)
        .end({name}).getCommand());
};

let createTopicSuggestion = function ({topic, created, userId}) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(user:User {userId: {userId}})`)
        .create(`(suggestion:TopicSuggestion {topic: {topic}, created: {created}})`)
        .merge(`(user)-[:SUGGEST]->(suggestion)`)
        .end({topic, created, userId}).getCommand());
};

module.exports = {
    createTopic,
    createTopicSuggestion
};