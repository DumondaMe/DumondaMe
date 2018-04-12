'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const exceptions = require('elyoos-server-lib').exceptions;
const image = require('./image');
const sharp = require('sharp');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createCommitmentCommand = function (params) {
    return db.cypher().match(`(c:Commitment {commitmentId: {commitmentId}}), (q:Question {questionId: {questionId}}), 
                (u:User {userId: {userId}})`)
        .create(`(answer:CommitmentAnswer:Answer {answerId: {answerId}, created: {created}, 
                 description: {description}})`)
        .merge(`(u)-[:IS_CREATOR {created: {created}}]->(answer)`)
        .merge(`(q)-[:ANSWER]->(answer)`)
        .merge(`(answer)-[:COMMITMENT]->(c)`)
        .merge(`(answer)-[:SHOW_ANSWER]->(c)`)
        .return(`u.name AS name`)
        .end(params).getCommand();
};

const handlingNotification = function (params) {
    return db.cypher().match(`(q:Question {questionId: {questionId}})-[:ANSWER]->(answer:CommitmentAnswer:Answer 
                            {answerId: {answerId}})-[:COMMITMENT]->
                            (c:Commitment {commitmentId: {commitmentId}}), (u:User {userId: {userId}})`)
        .where(`NOT (u)-[:IS_ADMIN]->(c)`)
        .optionalMatch(`(answer)-[showAnswer:SHOW_ANSWER]->(c)`)
        .delete(`showAnswer`)
        .with(`q, c`)
        .match(`(c)<-[:IS_ADMIN]-(admin:User)`)
        .where(`NOT (q)<-[:NOTIFICATION]-(:Notification {type: 'showQuestionRequest'})-[:NOTIFIED]->(admin)`)
        .merge(`(q)<-[:NOTIFICATION]-(:Notification {created: {created}, type: 'showQuestionRequest'})
              -[:NOTIFIED]->(admin)`)
        .end(params)
};

const checkSameLanguageCommand = function (commitmentId, questionId) {
    return db.cypher().match(`(q:Question {questionId: {questionId}}), (c:Commitment {commitmentId: {commitmentId}})`)
        .where(`q.language = c.language`)
        .return(`q`).end({commitmentId, questionId}).getCommand();
};

const checkCommitmentNotLinkedWithQuestion = async function (commitmentId, questionId) {
    let result = await db.cypher().match(`(q:Question {questionId: {questionId}})-[:ANSWER]->(:CommitmentAnswer )
                                          -[:COMMITMENT]->(:Commitment {commitmentId: {commitmentId}})`)
        .return(`q`)
        .end({commitmentId, questionId}).send([checkSameLanguageCommand(commitmentId, questionId)]);
    if (result[0].length === 0) {
        throw new exceptions.InvalidOperation(`Question ${questionId} has not same language as commitment ${commitmentId}`);
    }
    if (result[1].length > 0) {
        throw new exceptions.InvalidOperation(`Question ${questionId} is already linked with commtiment ${commitmentId}`);
    }
};

const createCommitmentAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    await checkCommitmentNotLinkedWithQuestion(params.commitmentId, params.questionId);
    let user = await handlingNotification(params).send([createCommitmentCommand(params)]);

    return {
        answerId: params.answerId,
        created: params.created,
        imageUrl: cdn.getPublicUrl(`commitment/${params.commitmentId}/120x120/title.jpg`),
        creator: {
            name: user[0][0].name,
            thumbnailUrl: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`)
        }
    }
};

module.exports = {
    createCommitmentAnswer
};
