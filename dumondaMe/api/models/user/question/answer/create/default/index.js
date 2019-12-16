'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const notification = require(`../notification`);
const link = require('./link');
const responseHandler = require('./response');
const image = require('./image');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);


const createDefaultAnswerCommand = function (params) {
    return db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .create(`(answer:Default:Answer${params.hasImage ? ':HasTitleImage' : ''} 
                  {answerId: {answerId}, answer: {answer}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:ANSWER]-(question)`)
        .return(`user.name AS name`)
        .end(params);
};

const createAnswer = async function (userId, params, titleImage, req) {
    let response;

    await image.checkImageMinWidth(titleImage, 1000, req);

    if (!params.createAnswerWithLink && typeof params.answer === 'string') {
        response = await link.getLinksOfAnswer(params.answer, params.questionId);
    }
    if (!response) {
        params.answerId = uuid.generateUUID();
        params.created = time.getNowUtcTimestamp();
        params.userId = userId;
        params.answer = params.answer || null;
        params.hasImage = typeof titleImage === 'string';
        let user = await createDefaultAnswerCommand(params).send();

        logger.info(`Created default answer ${params.answerId} for question ${params.questionId}`);
        await image.uploadImages(titleImage, params.answerId);
        let oneTimeNotificationCreated = await notification.addCreatedAnswerNotification(userId,
            params.answerId, params.created);

        response = await responseHandler.getResponse(userId, user[0].name, params, oneTimeNotificationCreated);
    }
    return response;
};

module.exports = {
    createAnswer
};
