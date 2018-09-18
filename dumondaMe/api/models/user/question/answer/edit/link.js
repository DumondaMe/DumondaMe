'use strict';

const db = requireDb();
const security = require('../security');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const editLinkAnswer = async function (userId, params) {
    await security.isAdmin(userId, params.answerId);
    await db.cypher().match(`(answer:Link:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {
            title: params.title, description: params.description, pageType: params.type,
            modified: time.getNowUtcTimestamp()
        })
        .end({userId, answerId: params.answerId}).send();
    logger.info(`Edit book answer with id ${params.answerId}`)
};

module.exports = {
    editLinkAnswer
};
