'use strict';

const db = requireDb();
const security = require('./../security');
const topicsUtil = require('./../../../util/topics');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const changeTopics = async function (userId, commitmentId, topics) {
    await security.isAdmin(userId, commitmentId);
    topicsUtil.normalizeTopics(topics);
    await db.cypher().match(`(c:Commitment {commitmentId: {commitmentId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .addCommand(topicsUtil.changeTopicsCommand('c'))
        .end({userId, commitmentId, topics}).send();
    logger.info(`Topics changed for commitment ${commitmentId}`);
};

module.exports = {
    changeTopics
};
