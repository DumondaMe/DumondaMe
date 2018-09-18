'use strict';

const db = requireDb();
const security = require('./../security');
const topicSecurity = require('./../../../topic/security');
const topicsUtil = require('./../../../util/topics');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const changeTopics = async function (userId, commitmentId, topics) {
    await security.isAdmin(userId, commitmentId);
    await topicSecurity.checkTopicsExists(topics);
    await db.cypher().match(`(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .addCommand(topicsUtil.changeTopicsCommand('c'))
        .end({userId, commitmentId, topics}).send();
    logger.info(`Topics changed for commitment ${commitmentId}`);
};

module.exports = {
    changeTopics
};
