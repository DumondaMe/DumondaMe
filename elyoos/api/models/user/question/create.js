'use strict';

const dashify = require('dashify');
const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createQuestion = async function (userId, params) {
    params.questionId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.description = params.description || null;
    await db.cypher().match("(user:User {userId: {userId}})")
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  language: {lang}, topic: {topic}, created: {created}})`)
        .merge(`(user)-[:IS_ADMIN]->(question)`)
        .end(params).send();
    logger.info(`Created question with id ${params.questionId}`);
    return {questionId: params.questionId, slug: dashify(params.question)};
};

module.exports = {
    createQuestion
};
