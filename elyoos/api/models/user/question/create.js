'use strict';

const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');
const db = requireDb();
const topics = require('./../../util/topics');
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createQuestion = async function (userId, params) {
    params.questionId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.description = params.description || null;
    if(params.description) {
        params.description = linkifyHtml(params.description);
    }
    topics.normalizeTopics(params.topics);
    await db.cypher().match("(user:User {userId: {userId}})")
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  language: {lang}, created: {created}})`)
        .foreach(`(topic IN {topics} | MERGE (:Topic {name: topic}))`)
        .merge(`(user)-[:IS_CREATOR]->(question)`)
        .with(`question`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(question)`)
        .end(params).send();
    logger.info(`Created question with id ${params.questionId}`);
    return {questionId: params.questionId, slug: dashify(params.question)};
};

module.exports = {
    createQuestion
};
