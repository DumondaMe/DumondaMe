'use strict';

const moreSearchResult = require('../../../../util/moreSearchResults');
const usersResponse = require('./response');
const queryParser = require('../../../../search/queryParser');
const db = requireDb();
const emailValidator = require("email-validator");

const getStartQuery = function (query) {
    if (emailValidator.validate(query)) {
        return db.cypher().match(`(user)`)
            .where(`(user:User OR user:InvitedUser) AND user.emailNormalized = {query}`)
            .with(`user, 0 AS weight`)
    } else {
        return db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS user, weight`)
            .where(`(user.privacyMode <> 'onlyContact' OR NOT EXISTS(user.privacyMode) OR
                (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))) AND
                user.userId <> {userId}`);
    }
};

const getUsersResponse = async function (users, query, userId) {
    query = query.trim();
    if (emailValidator.validate(query) && (users.length === 0 ||
        (users.length === 1 && users[0].userLabels.includes('InvitedUser')))) {
        return await usersResponse.getEmailResponse(users, query);
    } else {
        return await usersResponse.getResponse(users, userId);
    }
};

const searchCommand = function (query, questionId, userId, skip, limit) {
    query = queryParser.cleanQuery(query);
    let queryString = `User.name:("${query.trim()}"~20)^5 ${queryParser.wordsQuery(query, 'User.name:')}`;
    return getStartQuery(query)
        .optionalMatch(`(:User {userId: {userId}})-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)
                         -[:QUESTION_TO_ANSWER]->(:Question {questionId: {questionId}})`)
        .return(`DISTINCT user, EXISTS((user)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser, 
                 EXISTS((user)-[:IS_CONTACT]->(:User {userId: {userId}})) AS userTrustLoggedInUser, weight,
                 EXISTS((asked)-[:ASKED]->(user)) AS hasAlreadyAsked, LABELS(user) AS userLabels,
                 EXISTS((user)-[:IS_CREATOR]->(:Question {questionId: {questionId}})) AS isAdminOfQuestion,
                 EXISTS((user)-[:IS_CREATOR]->(:Answer)<-[:ANSWER]-(:Question {questionId: {questionId}})) 
                 AS userAnsweredQuestion`)
        .orderBy(`isTrustUser DESC, weight DESC, user.name`)
        .skip(`{skip}`).limit(`{limit}`)
        .end({queryString, query: query.toLowerCase(), questionId, userId, skip, limit});
};

const search = async function (query, questionId, userId, skip, limit) {
    let users = await searchCommand(query, questionId, userId, skip, limit + 1).send();
    let hasMoreUsers = moreSearchResult.getHasMoreResults(users, limit);
    let parsedUsers = await getUsersResponse(users, query, userId);
    return {users: parsedUsers, hasMoreUsers};
};

module.exports = {
    search
};
