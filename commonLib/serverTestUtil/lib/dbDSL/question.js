'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createQuestion = function (questionId, data) {
    data.description = data.description || null;
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorId}})')
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  created: {created}, modified: {modified}, language: {language}})`)
        .merge(`(question)<-[:IS_CREATOR]-(user)`)
        .foreach(`(topic in {topics} | MERGE (:Topic {name: topic}))`)
        .with(`question`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(question)`)
        .end({
            question: data.question, description: data.description, topics: data.topics, created: data.created,
            modified: data.modified, questionId: questionId, language: data.language, creatorId: data.creatorId
        }).getCommand());
};



module.exports = {
    createQuestion
};