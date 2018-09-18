'use strict';

const db = requireDb();
const linkifyHtml = require('linkifyjs/html');
const security = require('./security');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const editQuestion = async function (userId, params) {
    params.userId = userId;
    params.description = params.description || null;
    await security.isAdmin(userId, params.questionId);
    await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set(`question`, {
            question: params.question, description: params.description, language: params.lang,
            modified: time.getNowUtcTimestamp()
        })
        .end(params).send();
    logger.info(`Edit question with id ${params.questionId}`);
    let response = {};
    if(params.description) {
        response.descriptionHtml = linkifyHtml(params.description);
    }
    return response;
};

module.exports = {
    editQuestion
};
