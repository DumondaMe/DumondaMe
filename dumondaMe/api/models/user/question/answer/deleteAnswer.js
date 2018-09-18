'use strict';

const db = requireDb();
const security = require('./security');
const cdn = require('dumonda-me-server-lib').cdn;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

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
         <-[rel:NOTIFICATION]-(n:Notification {type: 'createdAnswer'})`)
        .match(`(n)-[rel2]->()`)
        .delete(`rel, rel2, n`)
        .end({userId, answerId}).getCommand();
};

const getAnswerType = function (answerId) {
    return db.cypher().match(`(answer:Answer {answerId: {answerId}})`)
        .return('labels(answer) AS labels, answer.answerId AS answerId')
        .end({answerId}).getCommand();
};

const deleteCdnFolder = async function (labels, answerId) {
    if (labels.includes('Link')) {
        await cdn.deleteFolder(`link/${answerId}/`, process.env.BUCKET_PUBLIC);
    } else if (labels.includes('Book')) {
        await cdn.deleteFolder(`book/${answerId}/`, process.env.BUCKET_PUBLIC);
    }
};

const deleteAnswer = async function (userId, answerId) {
    await security.isAdmin(userId, answerId);
    let result = await db.cypher().match(`(:Question)-[relQuestion:ANSWER]->(answer:Answer {answerId: {answerId}})
                              <-[relCreator:IS_CREATOR]-(:User {userId: {userId}})`)
        .optionalMatch(`(answer)-[noteRel:NOTE]->(note:Note)-[relOfNote]-()`)
        .optionalMatch(`(answer)-[additionalRel]-()`)
        .delete(`answer, relCreator, relQuestion, note, noteRel, relOfNote, additionalRel`)
        .end({answerId: answerId, userId: userId})
        .send([getAnswerType(answerId), deleteShowQuestionRequestNotifications(answerId),
            deleteShowQuestionOnCommitment(answerId), deleteCreatedAnswerNotification(userId, answerId)]);
    await deleteCdnFolder(result[0][0].labels, result[0][0].answerId);
    logger.info(`Delete answer with id ${answerId}`)
};

module.exports = {
    deleteAnswer
};
