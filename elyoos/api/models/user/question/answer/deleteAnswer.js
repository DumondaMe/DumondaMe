'use strict';

const db = requireDb();
const security = require('./security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const deleteAnswer = async function (userId, answerId) {
    await security.isAdmin(userId, answerId);
    await db.cypher().match(`(:Question)-[relQuestion:ANSWER]->(answer:Answer {answerId: {answerId}})
                              <-[relCreator:IS_CREATOR]-(:User {userId: {userId}})`)
        .optionalMatch(`(answer)-[noteRel:NOTE]->(note:Note)-[relOfNote]-()`)
        .optionalMatch(`(answer)-[commitmentRel:COMMITMENT]->(:Commitment)`)
        .delete(`answer, relCreator, relQuestion, note, noteRel, relOfNote, commitmentRel`)
        .end({answerId: answerId, userId: userId}).send();
    logger.info(`Delete answer with id ${answerId}`)
};

module.exports = {
    deleteAnswer
};
