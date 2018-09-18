'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;

const isAllowedToCreateSuggestion = async function (userId, questionId) {

    let response = await db.cypher()
        .match(`(question:Question {questionId: {questionId}}), (user:User {userId: {userId}})`)
        .where(`user:SuperUser AND NOT (user)-[:IS_CREATOR]->(question)`)
        .return(`question`)
        .end({questionId, userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not allowed to create suggestion for question ${questionId}`);
    }
};

const isAdminOfSuggestion = async function (userId, suggestionId) {

    let response = await db.cypher()
        .match(`(:QuestionSuggestion {suggestionId: {suggestionId}})<-[:IS_CREATOR]-(user:User {userId: {userId}})`)
        .return(`user`)
        .end({suggestionId, userId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is admin of suggestion ${suggestionId}`);
    }
};

module.exports = {
    isAllowedToCreateSuggestion,
    isAdminOfSuggestion
};
