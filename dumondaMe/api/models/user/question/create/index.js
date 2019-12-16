'use strict';

const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const topicsSecurity = require('./../../../topic/security');
const notifications = require('./notification');
const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const createQuestion = async function (userId, params) {
    params.questionId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.description = params.description || null;
    await topicsSecurity.checkTopicsExists(params.topics);
    await db.cypher().match("(user:User {userId: {userId}})")
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  language: {lang}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(question)`)
        .with(`question`)
        .match(`(topic:Topic)`)
        .where(`topic.topicId IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(question)`)
        .end(params).send();
    logger.info(`Created question with id ${params.questionId}`);
    let oneTimeNotificationCreated = await notifications.addNotifications(userId, params.questionId, params.created);
    let response = {questionId: params.questionId, slug: slug(params.question), oneTimeNotificationCreated};
    if (params.description) {
        response.descriptionHtml = linkifyHtml(params.description, {attributes: {rel: 'noopener'}});
    }
    return response;
};

module.exports = {
    createQuestion
};
