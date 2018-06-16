'use strict';

const db = requireDb();
const security = require('./security');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const deleteShowQuestionRequestNotifications = function (answerId) {
    return db.cypher()
        .match(`(:Question)-[relQuestion:ANSWER]->(answer:CommitmentAnswer {answerId: {answerId}})
                 -[:COMMITMENT]->(:Commitment)<-[rel:NOTIFICATION]-(n:Notification {type: 'showQuestionRequest'})
                 -[rel2]-()`)
        .delete(`rel, rel2, n`)
        .end({answerId: answerId}).getCommand();
};

const deleteShowQuestionOnCommitment = function (answerId) {
    return db.cypher()
        .match(`(question:Question)-[:ANSWER]->(:CommitmentAnswer {answerId: {answerId}})
                 -[:COMMITMENT]->(commitment:Commitment)`)
        .match(`(question)<-[rel:SHOW_QUESTION]-(commitment)`)
        .delete(`rel`)
        .end({answerId: answerId}).getCommand();
};

const deleteCreatedAnswerNotification = function (userId, answerId) {
    return db.cypher()
        .match(`(creatorAnswer:User {userId: {userId}})-[:IS_CREATOR]->(answer:Answer {answerId: {answerId}})
         <-[rel:NOTIFICATION]-(n:Notification)`)
        .match(`(n)-[rel2]->()`)
        .delete(`rel, rel2, n`)
        .end({userId, answerId}).getCommand();
};

const deleteAnswer = async function (userId, answerId) {
    await security.isAdmin(userId, answerId);
    await db.cypher().match(`(:Question)-[relQuestion:ANSWER]->(answer:Answer {answerId: {answerId}})
                              <-[relCreator:IS_CREATOR]-(:User {userId: {userId}})`)
        .optionalMatch(`(answer)-[noteRel:NOTE]->(note:Note)-[relOfNote]-()`)
        .optionalMatch(`(answer)-[additionalRel]-()`)
        .delete(`answer, relCreator, relQuestion, note, noteRel, relOfNote, additionalRel`)
        .end({answerId: answerId, userId: userId})
        .send([deleteShowQuestionRequestNotifications(answerId), deleteShowQuestionOnCommitment(answerId),
            deleteCreatedAnswerNotification(userId, answerId)]);
    logger.info(`Delete answer with id ${answerId}`)
};

module.exports = {
    deleteAnswer
};
