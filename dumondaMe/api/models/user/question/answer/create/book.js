'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const cdn = require('dumonda-me-server-lib').cdn;
const exceptions = require('dumonda-me-server-lib').exceptions;
const image = require('./image');
const notification = require(`./notification`);
const sharp = require('sharp');
const slug = require('limax');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

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

const uploadImages = async function (params) {
    let buffer = await image.uploadPreviewImage(`book/${params.answerId}/preview.jpg`, params.imageUrl, 500, 500);
    if (buffer) {
        let resizedBuffer = await sharp(buffer).background({r: 255, g: 255, b: 255, alpha: 0}).flatten()
            .resize(120, 250).max().jpeg({quality: 80}).withoutEnlargement().toBuffer();
        await cdn.uploadBuffer(resizedBuffer, `book/${params.answerId}/120x250/preview.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

const createBookAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.hasPreviewImage = typeof params.imageUrl === 'string';
    let user = await createBookAnswerOriginalLinkCommand(params)
        .send([createBookAnswerCommand(params),
            notification.addCreatedAnswerNotification(userId, params.answerId, params.created).getCommand()]);
    if (user[0].length === 1) {
        await uploadImages(params);
        logger.info(`Created book answer ${params.answerId} for question ${params.questionId}`);
        const result = {
            answerId: params.answerId, created: params.created,
            creator: {
                name: user[0][0].name,
                slug: slug(user[0][0].name),
                userImage: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/${userId}/profilePreview.jpg`),
                isLoggedInUser: true,
                isTrustUser: false
            }
        };
        if (params.imageUrl) {
            result.imageUrl = cdn.getPublicUrl(`book/${params.answerId}/120x250/preview.jpg`);
        }
        return result;
    }
    throw new exceptions.InvalidOperation(`Book answer ${params.googleBookId} exists already for question 
            ${params.questionId}`, ERROR_CODE_BOOK_EXISTS_ALREADY);
};

module.exports = {
    createBookAnswer
};
