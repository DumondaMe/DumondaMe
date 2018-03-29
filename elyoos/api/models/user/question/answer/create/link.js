'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const sharp = require('sharp');
const image = require('./image');
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const ERROR_CODE_LINK_EXISTS_ALREADY = 2;

const createLinkAnswerCommand = function (params) {
    return db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .where(`NOT (question)-[:ANSWER]->(:Link {link: {link}})`)
        .create(`(answer:Link:Answer {answerId: {answerId}, link: {link}, created: {created}, title: {title},
                      description: {description}, pageType: {type}, hasPreviewImage: {hasPreviewImage}})`)
        .merge(`(user)-[:IS_CREATOR]->(answer)<-[:ANSWER]-(question)`)
        .return(`user.name AS name`)
        .end(params).getCommand();
};

const createLinkAnswerOriginalLinkCommand = function (params) {
    return db.cypher().match(`(original:Link {link: {link}})`)
        .where(`original.answerId <> {answerId}`)
        .with(`original, EXISTS((:Link)-[:ORIGINAL]->(original)) AS isOriginal`)
        .orderBy(`isOriginal DESC, original.created DESC`)
        .limit(1)
        .match(`(created:Link {answerId: {answerId}})`)
        .merge(`(created)-[:ORIGINAL]->(original)`)
        .end(params);
};

const uploadImages = async function (params) {
    let buffer = await image.uploadPreviewImage(`link/${params.answerId}/preview.jpg`, params.imageUrl, 500, 500);
    if (buffer) {
        let resizeBuffer = await sharp(buffer).resize(120, 120).max().jpeg({quality: 80})
            .withoutEnlargement().toBuffer();
        await cdn.uploadBuffer(resizeBuffer, `link/${params.answerId}/120x120/preview.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

const createLinkAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.hasPreviewImage = typeof params.imageUrl === 'string';
    let user = await createLinkAnswerOriginalLinkCommand(params).send([createLinkAnswerCommand(params)]);
    if (user[0].length === 1) {
        await uploadImages(params);
        logger.info(`Created link answer ${params.answerId} for question ${params.questionId}`);
        const result = {
            answerId: params.answerId, created: params.created,
            creator: {
                name: user[0][0].name,
                thumbnailUrl: await cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`)
            }
        };
        if (params.imageUrl) {
            result.imageUrl = cdn.getPublicUrl(`link/${params.answerId}/120x120/preview.jpg`);
        }
        return result;
    }
    throw new exceptions.InvalidOperation(`Link answer ${params.link} exists already for question 
            ${params.questionId}`, ERROR_CODE_LINK_EXISTS_ALREADY);
};

module.exports = {
    createLinkAnswer
};
