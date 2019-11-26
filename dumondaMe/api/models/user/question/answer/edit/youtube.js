'use strict';

const db = requireDb();
const security = require('../security');
const time = require('dumonda-me-server-lib').time;
const response = require('./response');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);


const editYoutubeAnswer = async function (userId, params) {
    await security.isAdmin(userId, params.answerId);
    await db.cypher()
        .match(`(answer:Youtube:Answer {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {
            title: params.title, description: params.description, modified: time.getNowUtcTimestamp()
        })
        .end({userId, answerId: params.answerId}).send();
    logger.info(`Edit youtube answer with id ${params.answerId}`);
    return response.getEditResponse(params.description);
};

module.exports = {
    editYoutubeAnswer
};
