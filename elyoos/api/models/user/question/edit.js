'use strict';

const db = requireDb();
const security = require('./security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editQuestion = async function (userId, params) {
    params.userId = userId;
    params.description = params.description || null;
    await security.isAdmin(userId, params.questionId);
    await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`question`, {
            question: params.question, description: params.description, topic: params.topic,
            modified: time.getNowUtcTimestamp()
        })
        .end(params).send();
    logger.info(`Edit question with id ${params.questionId}`);
};

module.exports = {
    editQuestion
};
