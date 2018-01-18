'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createQuestion = function (questionId, data) {
    data.description = data.description || null;
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {adminId}})')
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  created: {created}, modified: {modified}, topic: {topic}, language: {language}})`)
        .merge(`(question)<-[:IS_ADMIN]-(user)`)
        .end({
            question: data.question, description: data.description, topic: data.topic, created: data.created,
            modified: data.modified, questionId: questionId, language: data.language, adminId: data.adminId
        }).getCommand());
};

let createAnswer = function (answerId, data) {
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {adminId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(answer:Answer {answerId: {answerId}, answer: {answer},
                  created: {created}, modified: {modified}})`)
        .merge(`(question)-[:ANSWER]->(answer)<-[:IS_ADMIN]-(user)`)
        .end({
            answer: data.answer, created: data.created, questionId: data.questionId,
            modified: data.modified, answerId: answerId, adminId: data.adminId
        }).getCommand());
};

let upVoteAnswer = function (userId, answerId) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})')
        .createUnique(`(user)-[:UP_VOTE]->(answer)`)
        .end({userId: userId, answerId: answerId}).getCommand());
};

module.exports = {
    createQuestion,
    createAnswer,
    upVoteAnswer
};