'use strict';

const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const topicsSecurity = require('./../../topic/security');
const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const createNotification = function (userId, questionId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher()
        .match(`(q:Question {questionId: {questionId}})<-[:IS_CREATOR]-(creator:User {userId: {userId}})` +
            `<-[:IS_CONTACT]-(notifiedUser:User)`)
        .create(`(notification:Notification:Unread {type: 'newQuestion', created: {created},` +
            `notificationId: randomUUID()})`)
        .merge(`(creator)<-[:ORIGINATOR_OF_NOTIFICATION {created: {created}}]-(notification)`)
        .merge(`(notification)-[:NOTIFICATION]->(q)`)
        .merge(`(notification)-[:NOTIFIED]->(notifiedUser)`)
        .end({userId, questionId, created, notificationId})
};

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
    await createNotification(userId, params.questionId, params.created).send();
    let response = {questionId: params.questionId, slug: slug(params.question)};
    if (params.description) {
        response.descriptionHtml = linkifyHtml(params.description, {attributes: {rel: 'noopener'}});
    }
    return response;
};

module.exports = {
    createQuestion
};
