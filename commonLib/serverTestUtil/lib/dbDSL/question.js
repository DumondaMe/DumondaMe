'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createQuestion = function (questionId, data) {
    data.description = data.description || null;
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorId}})')
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  created: {created}, modified: {modified}, topic: {topic}, language: {language}})`)
        .merge(`(question)<-[:IS_CREATOR]-(user)`)
        .end({
            question: data.question, description: data.description, topic: data.topic, created: data.created,
            modified: data.modified, questionId: questionId, language: data.language, creatorId: data.creatorId
        }).getCommand());
};



module.exports = {
    createQuestion
};