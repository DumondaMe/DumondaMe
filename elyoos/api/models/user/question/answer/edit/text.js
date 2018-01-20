'use strict';

const db = requireDb();
const security = require('../security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editTextAnswer = async function (userId, params) {
    params.userId = userId;
    await security.isAdmin(userId, params.answerId);
    await db.cypher().match(`(answer:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {title: params.title, description: params.title, modified: time.getNowUtcTimestamp()})
        .end(params).send();
    logger.info(`Edit answer with id ${params.answerId}`)
};

module.exports = {
    editTextAnswer
};
