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

let createTextAnswer = function (answerId, data) {
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(answer:Answer {answerId: {answerId}, answer: {answer},
                  created: {created}, modified: {modified}})`)
        .merge(`(question)-[:TEXT_ANSWER]->(answer)<-[:IS_CREATOR]-(user)`)
        .end({
            answer: data.answer, created: data.created, questionId: data.questionId,
            modified: data.modified, answerId: answerId, creatorId: data.creatorId
        }).getCommand());
};

let upVoteAnswer = function (userId, answerId) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})')
        .createUnique(`(user)-[:UP_VOTE]->(answer)`)
        .end({userId: userId, answerId: answerId}).getCommand());
};

module.exports = {
    createQuestion,
    createTextAnswer,
    upVoteAnswer
};