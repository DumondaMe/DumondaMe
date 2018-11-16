'use strict';

const db = requireDb();
const linkifyHtml = require('linkifyjs/html');
const security = require('../security');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const editTextAnswer = async function (userId, params) {
    params.userId = userId;
    await security.isAdmin(userId, params.answerId);
    await db.cypher().match(`(answer:Text {answerId: {answerId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`answer`, {answer: params.answer, modified: time.getNowUtcTimestamp()})
        .end(params).send();
    logger.info(`Edit answer with id ${params.answerId}`);
    return {answerHtml: linkifyHtml(params.answer, {attributes: {rel: 'noopener'}})};
};

module.exports = {
    editTextAnswer
};
