'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createTextAnswer = async function (userId, params) {
    params.textId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    let user = await db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .create(`(answer:Text {textId: {textId}, answer: {answer}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:ANSWER]-(question)`)
        .return(`user.name AS name`)
        .end(params).send();
    logger.info(`Created text answer ${params.textId} for question ${params.questionId}`);
    return {
        textId: params.textId, created: params.created,
        creator: {name: user[0].name, thumbnailUrl: cdn.getUrl(`profileImage/${userId}/thumbnail.jpg`)}
    };
};

module.exports = {
    createTextAnswer
};
