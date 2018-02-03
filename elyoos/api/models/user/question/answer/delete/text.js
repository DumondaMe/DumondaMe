'use strict';

const db = requireDb();
const security = require('../security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const deleteTextAnswer = async function (userId, answerId) {
    await security.isAdmin(userId, answerId);
    await db.cypher().match(`(:Question)-[relQuestion:ANSWER]->(answer:Text {answerId: {answerId}})
                              <-[relCreator:IS_CREATOR]-(:User {userId: {userId}})`)
        .delete(`answer, relCreator, relQuestion`)
        .end({answerId: answerId, userId: userId}).send();
    logger.info(`Edit answer with id ${answerId}`)
};

module.exports = {
    deleteTextAnswer
};
