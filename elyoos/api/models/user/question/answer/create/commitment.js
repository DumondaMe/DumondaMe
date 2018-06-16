'use strict';

const dashify = require('dashify');
const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const exceptions = require('elyoos-server-lib').exceptions;
const notification = require(`./notification`);

const createCommitmentCommand = function (params) {
    return db.cypher().match(`(c:Commitment {commitmentId: {commitmentId}}), (q:Question {questionId: {questionId}}), 
                (u:User {userId: {userId}})`)
        .create(`(answer:CommitmentAnswer:Answer {answerId: {answerId}, created: {created}, 
                 description: {description}})`)
        .merge(`(u)-[:IS_CREATOR {created: {created}}]->(answer)`)
        .merge(`(q)-[:ANSWER]->(answer)`)
        .merge(`(answer)-[:COMMITMENT]->(c)`)
        .return(`u.name AS userName, c.title AS commitmentTitle, EXISTS((c)<-[:IS_ADMIN]-(u)) AS isAdminOfCommitment`)
        .end(params).getCommand();
};

const showQuestionRequestNotification = function (params) {
    params.notificationId = uuid.generateUUID();
    return db.cypher().match(`(q:Question {questionId: {questionId}})-[:ANSWER]->(answer:CommitmentAnswer:Answer 
                            {answerId: {answerId}})-[:COMMITMENT]->
                            (c:Commitment {commitmentId: {commitmentId}})`)
        .match(`(c)<-[:IS_ADMIN]-(admin:User)`)
        .merge(`(q)<-[:NOTIFICATION]-(notification:Notification {created: {created}, type: 'showQuestionRequest',
                notificationId: {notificationId}})-[:NOTIFIED]->(admin)`)
        .with(`notification, c`)
        .merge(`(c)<-[:NOTIFICATION]-(notification)`)
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
    let commitment = await showQuestionRequestNotification(params).send([createCommitmentCommand(params),
        notification.addCreatedAnswerNotification(userId, params.answerId, params.created).getCommand()]);

    return {
        answerId: params.answerId,
        created: params.created,
        slug: dashify(commitment[0][0].commitmentTitle),
        imageUrl: cdn.getPublicUrl(`commitment/${params.commitmentId}/120x120/title.jpg`),
        creator: {
            name: commitment[0][0].userName,
            isAdminOfCommitment: commitment[0][0].isAdminOfCommitment,
            thumbnailUrl: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`)
        }
    }
};

module.exports = {
    createCommitmentAnswer
};
