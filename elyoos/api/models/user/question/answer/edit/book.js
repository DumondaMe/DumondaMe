'use strict';

const db = requireDb();
const security = require('../security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editBookAnswer = async function (userId, params) {

    await security.isAdmin(userId, params.answerId);
    await db.cypher().match(`(answer:Book:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {
            title: params.title, description: params.description, authors: params.authors,
            modified: time.getNowUtcTimestamp()
        })
        .end({userId, answerId: params.answerId}).send();
    logger.info(`Edit book answer with id ${params.answerId}`)
};

module.exports = {
    editBookAnswer
};
