'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const exceptions = require('elyoos-server-lib').exceptions;
const image = require('./image');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const ERROR_CODE_BOOK_EXISTS_ALREADY = 2;

const createBookAnswerCommand = function (params) {
    return db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .where(`NOT (question)-[:ANSWER]->(:Book {googleBookId: {googleBookId}})`)
        .create(`(answer:Book:Answer {answerId: {answerId}, created: {created}, title: {title},
                      description: {description}, hasPreviewImage: {hasPreviewImage}, googleBookId: {googleBookId},
                      authors: {authors}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:ANSWER]-(question)`)
        .return(`user.name AS name`)
        .end(params).getCommand();
};

const createBookAnswerOriginalLinkCommand = function (params) {
    return db.cypher().match(`(original:Book {googleBookId: {googleBookId}})`)
        .where(`original.answerId <> {answerId}`)
        .with(`original, EXISTS((:Book)-[:ORIGINAL]->(original)) AS isOriginal`)
        .orderBy(`isOriginal DESC, original.created DESC`)
        .limit(1)
        .match(`(created:Book {answerId: {answerId}})`)
        .merge(`(created)-[:ORIGINAL]->(original)`)
        .end(params);
};

const createBookAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.hasPreviewImage = typeof params.imageUrl === 'string';
    let user = await createBookAnswerOriginalLinkCommand(params).send([createBookAnswerCommand(params)]);
    if (user[0].length === 1) {
        await image.uploadPreviewImage(`book/${params.answerId}/preview.jpg`, params.imageUrl, 500, 500);
        logger.info(`Created book answer ${params.answerId} for question ${params.questionId}`);
        const result = {
            answerId: params.answerId, created: params.created,
            creator: {
                name: user[0][0].name,
                thumbnailUrl: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`)
            }
        };
        if (params.imageUrl) {
            result.imageUrl = cdn.getPublicUrl(`120x250/book/${params.answerId}/preview.jpg`);
        }
        return result;
    }
    throw new exceptions.InvalidOperation(`Book answer ${params.googleBookId} exists already for question 
            ${params.questionId}`, ERROR_CODE_BOOK_EXISTS_ALREADY);
};

module.exports = {
    createBookAnswer
};
