'use strict';

const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');
const topicsSecurity = require('./../../topic/security');
const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
    let response = {questionId: params.questionId, slug: dashify(params.question)};
    if(params.description) {
        response.descriptionHtml = linkifyHtml(params.description);
    }
    return response;
};

module.exports = {
    createQuestion
};
