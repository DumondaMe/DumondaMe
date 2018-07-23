'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createTopic = function (name) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(:Topic {name: {name}})`)
        .end({name}).getCommand());
};

let createMainTopic = function ({topicId, descriptionDe, descriptionEn, similarDe, similarEn}) {
    similarDe = similarDe || [];
    similarEn = similarEn || [];
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(:MainTopic:Topic {topicId: {topicId}, de: {descriptionDe}, en: {descriptionEn}, similarDe: {similarDe}, similarEn: {similarEn}})`)
        .end({topicId, descriptionDe, descriptionEn, similarDe, similarEn}).getCommand());
};

let createSubTopic = function ({parentTopicId, topicId, descriptionDe, descriptionEn, similarDe, similarEn}) {
    similarDe = similarDe || [];
    similarEn = similarEn || [];
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(mainTopic:MainTopic {topicId: {parentTopicId}})`)
        .create(`(topic:Topic {topicId: {topicId}, de: {descriptionDe}, en: {descriptionEn}, similarDe: {similarDe}, similarEn: {similarEn}})`)
        .merge(`(mainTopic)-[:SUB_TOPIC]->(topic)`)
        .end({parentTopicId, topicId, descriptionDe, descriptionEn, similarDe, similarEn}).getCommand());
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
    createMainTopic,
    createSubTopic,
    createTopicSuggestion
};