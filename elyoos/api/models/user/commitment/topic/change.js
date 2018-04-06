'use strict';

const db = requireDb();
const security = require('./../security');
const topicsUtil = require('./../../../util/topics');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const changeTopics = async function (userId, answerId, topics) {
    await security.isAdmin(userId, answerId);
    topicsUtil.normalizeTopics(topics);
    await db.cypher().match(`(commitment:Commitment {answerId: {answerId}})<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .addCommand(topicsUtil.changeTopicsCommand('commitment'))
        .end({userId, answerId, topics}).send();
    logger.info(`Topics changed for commitment with id ${answerId}`);
};

module.exports = {
    changeTopics
};
