'use strict';

const db = requireDb();
const security = require('./security');
const topics = require('./../../util/topics');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editQuestion = async function (userId, params) {
    params.userId = userId;
    params.description = params.description || null;
    await security.isAdmin(userId, params.questionId);
    topics.normalizeTopics(params.topics);
    await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`question`, {
            question: params.question, description: params.description,
            modified: time.getNowUtcTimestamp()
        })
        .foreach(`(topic IN {topics} | MERGE (:Topic {name: topic}))`)
        .with(`question`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(question)`)
        .with(`DISTINCT question`)
        .match(`(topic:Topic)`)
        .where(`NOT topic.name IN {topics} AND (topic)-[:TOPIC]->(question)`)
        .match(`(topic)-[relTopic:TOPIC]->(question)`)
        .delete(`relTopic`)
        .with(`topic`)
        .where(`NOT EXISTS((topic)-[:TOPIC]->())`)
        .delete(`topic`)
        .end(params).send();
    logger.info(`Edit question with id ${params.questionId}`);
};

module.exports = {
    editQuestion
};
