'use strict';

const slug = require('limax');
const cdn = require('elyoos-server-lib').cdn;
const db = requireDb();
const security = require('./security');
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createSuggestion = async function (userId, questionId, title, description, explanation) {
    let suggestionId = uuid.generateUUID(), created = time.getNowUtcTimestamp();
    await security.isAllowedToCreateSuggestion(userId, questionId);
    let dbResponse = await db.cypher()
        .match("(question:Question {questionId: {questionId}}), (user:User {userId: {userId}})")
        .create(`(suggestion:QuestionSuggestion {suggestionId: {suggestionId}, title: {title}, 
                  description: {description}, explanation: {explanation}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(suggestion)`)
        .merge(`(suggestion)-[:SUGGESTION]->(question)`)
        .return(`user.name AS name`)
        .end({userId, questionId, title, description, explanation, suggestionId, created}).send();
    if (dbResponse.length === 1) {
        logger.info(`Created suggestion ${suggestionId} for question ${questionId}`);
        let response = {
            suggestionId, created, creator: {
                userId: userId, name: dbResponse[0].name, slug: slug(dbResponse[0].name),
                userImage: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/${userId}/profilePreview.jpg`),
                isLoggedInUser: true, isTrustUser: false
            }
        };
        return response;
    }
};

module.exports = {
    createSuggestion
};
