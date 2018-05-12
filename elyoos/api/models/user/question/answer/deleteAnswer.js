'use strict';

const db = requireDb();
const security = require('./security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const deleteNotifications = function (answerId) {
    return db.cypher()
        .match(`(:Question)-[relQuestion:ANSWER]->(answer:CommitmentAnswer {answerId: {answerId}})
                 -[:COMMITMENT]->(:Commitment)<-[rel:NOTIFICATION]-(n:Notification {type: 'showQuestionRequest'})
                 -[rel2]-()`)
        .delete(`rel, rel2, n`)
        .end({answerId: answerId}).getCommand();
};

const deleteShowQuestionInCommitment = function (answerId) {
    return db.cypher()
        .match(`(question:Question)-[:ANSWER]->(:CommitmentAnswer {answerId: {answerId}})
                 -[:COMMITMENT]->(commitment:Commitment)`)
        .match(`(question)<-[rel:SHOW_QUESTION]-(commitment)`)
        .delete(`rel`)
        .end({answerId: answerId}).getCommand();
};

const deleteAnswer = async function (userId, answerId) {
    await security.isAdmin(userId, answerId);
    await db.cypher().match(`(:Question)-[relQuestion:ANSWER]->(answer:Answer {answerId: {answerId}})
                              <-[relCreator:IS_CREATOR]-(:User {userId: {userId}})`)
        .optionalMatch(`(answer)-[noteRel:NOTE]->(note:Note)-[relOfNote]-()`)
        .optionalMatch(`(answer)-[commitmentRel:COMMITMENT]->(:Commitment)`)
        .delete(`answer, relCreator, relQuestion, note, noteRel, relOfNote, commitmentRel`)
        .end({answerId: answerId, userId: userId})
        .send([deleteNotifications(answerId), deleteShowQuestionInCommitment(answerId)]);
    logger.info(`Delete answer with id ${answerId}`)
};

module.exports = {
    deleteAnswer
};
