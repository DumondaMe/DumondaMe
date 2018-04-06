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
        .addCommand(topics.changeTopicsCommand('question'))
        .end(params).send();
    logger.info(`Edit question with id ${params.questionId}`);
};

module.exports = {
    editQuestion
};
