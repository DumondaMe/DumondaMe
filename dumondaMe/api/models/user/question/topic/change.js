'use strict';

const db = requireDb();
const security = require('./../security');
const topicSecurity = require('./../../../topic/security');
const topicsUtil = require('./../../../util/topics');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const changeTopics = async function (userId, questionId, topics) {
    await security.isAdmin(userId, questionId);
    await topicSecurity.checkTopicsExists(topics);
    await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .addCommand(topicsUtil.changeTopicsCommand('question'))
        .end({userId, questionId, topics}).send();
    logger.info(`Topics changed for question with id ${questionId}`);
};

module.exports = {
    changeTopics
};
