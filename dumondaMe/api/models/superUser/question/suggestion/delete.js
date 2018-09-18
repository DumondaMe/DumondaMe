'use strict';

const db = requireDb();
const security = require('./security');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const deleteSuggestion = async function (userId, suggestionId) {
    await security.isAdminOfSuggestion(userId, suggestionId);
    await db.cypher().match(`(s:QuestionSuggestion {suggestionId: {suggestionId}})-[rel]-()`)
        .delete(`s, rel`)
        .end({suggestionId}).send();

    logger.info(`Delete of suggestion ${suggestionId}`);
};

module.exports = {
    deleteSuggestion
};
