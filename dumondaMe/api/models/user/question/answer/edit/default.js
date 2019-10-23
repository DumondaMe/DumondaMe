'use strict';

const db = requireDb();
const linkifyHtml = require('linkifyjs/html');
const security = require('../security');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const editAnswer = async function (userId, params) {
    params.userId = userId;
    await security.isAdmin(userId, params.answerId);
    await db.cypher().match(`(answer:Default {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {answer: params.answer, modified: time.getNowUtcTimestamp()})
        .end(params).send();
    logger.info(`Edit default answer with id ${params.answerId}`);
    return {answerHtml: linkifyHtml(params.answer, {attributes: {rel: 'noopener'}})};
};

module.exports = {
    editAnswer
};
