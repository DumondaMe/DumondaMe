'use strict';

const db = requireDb();
const security = require('../security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editTextAnswer = async function (userId, params) {
    params.userId = userId;
    await security.isAdmin(userId, params.textId);
    await db.cypher().match(`(answer:Text {textId: {textId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {answer: params.answer, modified: time.getNowUtcTimestamp()})
        .end(params).send();
    logger.info(`Edit answer with id ${params.textId}`)
};

module.exports = {
    editTextAnswer
};
