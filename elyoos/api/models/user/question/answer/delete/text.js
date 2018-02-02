'use strict';

const db = requireDb();
const security = require('../security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const deleteTextAnswer = async function (userId, textId) {
    await security.isAdmin(userId, textId);
    await db.cypher().match(`(:Question)-[relQuestion:ANSWER]->(answer:Text {textId: {textId}})
                              <-[relCreator:IS_CREATOR]-(:User {userId: {userId}})`)
        .delete(`answer, relCreator, relQuestion`)
        .end({textId: textId, userId: userId}).send();
    logger.info(`Edit answer with id ${textId}`)
};

module.exports = {
    deleteTextAnswer
};
