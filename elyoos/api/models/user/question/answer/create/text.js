'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createTextAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    await db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .create(`(answer:Answer {answerId: {answerId}, title: {title}, 
                  description: {description}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:TEXT_ANSWER]-(question)`)
        .end(params).send();
    logger.info(`Created answer ${params.answerId} for question ${params.questionId}`);
    return {answerId: params.answerId};
};

module.exports = {
    createTextAnswer
};
