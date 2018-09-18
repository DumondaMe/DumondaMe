'use strict';

const db = requireDb();
const security = require('./security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editSuggestion = async function (userId, suggestionId, title, description, explanation) {
    await security.isAdminOfSuggestion(userId, suggestionId);
    await db.cypher()
        .match(`(s:QuestionSuggestion {suggestionId: {suggestionId}})<-[:IS_CREATOR]-(:User {userId: {userId}})`)
        .set('s', {title, description, explanation})
        .end({userId, suggestionId}).send();

    logger.info(`Edit of suggestion ${suggestionId}`);
};

module.exports = {
    editSuggestion
};
