'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createQuestion = function (questionId, data) {
    data.description = data.description || `question${questionId}Description`;
    data.modified = data.modified || null;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {adminId}})')
        .create(`(:ForumQuestion {questionId: {questionId}, description: {description}, created: {created}, modified: {modified},
                                  topic: {topic}, language: {language}})
                                           <-[:IS_ADMIN]-(user)`)
        .end({
            description: data.description, topic: data.topic, created: data.created, modified: data.modified, questionId: questionId,
            language: data.language, adminId: data.adminId
        }).getCommand());
};

let createAnswer = function (answerId, data, type) {
    data.description = data.description || `${type}${answerId}Description`;
    data.title = data.title || `${type}${answerId}Title`;
    data.modified = data.modified || null;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {adminId}}), (question:ForumQuestion {questionId: {questionId}})')
        .create(`(question)-[:IS_ANSWER]->(:ForumAnswer {answerId: {answerId}, title: {title}, description: {description}, created: {created}, modified: {modified}, type: {type}})
                                           <-[:IS_ADMIN]-(user)`)
        .end({
            answerId: answerId, questionId: data.questionId, adminId: data.adminId, title: data.title, description: data.description,
            created: data.created, modified: data.modified, type: type
        }).getCommand());
    if (data.referencePageId) {
        dbConnectionHandling.getCommands().push(db.cypher().match('(answer:ForumAnswer {answerId: {answerId}}), (page:Page {pageId: {pageId}})')
            .createUnique(`(answer)-[:REFERENCE]->(page)`)
            .end({pageId: data.referencePageId, answerId: answerId}).getCommand());
    }
};

let createSolution = function (answerId, data) {
    createAnswer(answerId, data, 'solution');
};

let createProArgument = function (answerId, data) {
    createAnswer(answerId, data, 'proArgument');
};

let createCounterArgument = function (answerId, data) {
    createAnswer(answerId, data, 'counterArgument');
};

let ratePositiveAnswer = function (userId, answerId) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (answer:ForumAnswer {answerId: {answerId}})')
        .createUnique(`(user)-[:RATE_POSITIVE]->(answer)`)
        .end({userId: userId, answerId: answerId}).getCommand());
};

module.exports = {
    createQuestion: createQuestion,
    createSolution: createSolution,
    createProArgument: createProArgument,
    createCounterArgument: createCounterArgument,
    ratePositiveAnswer: ratePositiveAnswer
};