'use strict';

const db = requireDb();
const security = require('../security');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const editCommitmentAnswer = async function (userId, params) {
    await security.isAdmin(userId, params.answerId);
    await db.cypher()
        .match(`(answer:CommitmentAnswer:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {description: params.description, modified: time.getNowUtcTimestamp()})
        .end({userId, answerId: params.answerId}).send();
    logger.info(`Edit commitment answer with id ${params.answerId}`)
};

module.exports = {
    editCommitmentAnswer
};
