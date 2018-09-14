'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const moreResults = require('../util/moreSearchResults');
const cdn = require('elyoos-server-lib').cdn;
const answerParser = require('./answer/answerParser');
const answers = require('./answers');
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');

const PAGE_SIZE = 20;

const getSuggestionResponse = async function (suggestions, userId) {
    for (let suggestion of suggestions) {
        suggestion.creator = {
            name: suggestion.user.name,
            userId: suggestion.user.userId,
            slug: slug(suggestion.user.name),
            userImage: await cdn.getSignedUrl(`profileImage/${suggestion.user.userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${suggestion.user.userId}/profilePreview.jpg`),
            isLoggedInUser: suggestion.user.userId === userId,
            isTrustUser: suggestion.isTrustUser,
        };
        delete suggestion.user;
        delete suggestion.isTrustUser;
    }
    return suggestions;
};

const isAllowedToWatchSuggestions = async function (questionId, userId, superUser) {
    let response = await db.cypher()
        .match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .return(`question`).end({questionId, userId}).send();
    if (response.length === 0 && !superUser) {
        throw new exceptions.InvalidOperation(`User ${userId} is not admin of question ${questionId} or super user`);
    }
};

const getSuggestions = async function (questionId, page, userId, superUser) {
    await isAllowedToWatchSuggestions(questionId, userId, superUser);

    page = PAGE_SIZE * page;
    let dbResponse = await db.cypher()
        .match(`(:Question {questionId: {questionId}})<-[:SUGGESTION]-(s:QuestionSuggestion)
                 <-[:IS_CREATOR]-(user:User)`)
        .return(`s.title AS title, s.description AS description, s.explanation AS explanation, s.created AS created, 
                 s.suggestionId AS suggestionId, user,
                 exists((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isTrustUser`)
        .orderBy(`created DESC`)
        .skip(`{page}`)
        .limit(`${PAGE_SIZE + 1}`)
        .end({questionId, page, userId}).send();

    let hasMoreSuggestions = moreResults.getHasMoreResults(dbResponse, PAGE_SIZE);
    return {hasMoreSuggestions, suggestions: await getSuggestionResponse(dbResponse, userId)};
};

module.exports = {
    getSuggestions
};
