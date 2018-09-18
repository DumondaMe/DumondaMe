'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const cdn = require('dumonda-me-server-lib').cdn;
const sharp = require('sharp');
const slug = require('limax');
const image = require('./image');
const notification = require(`./notification`);
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

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
        let resizeBuffer = await sharp(buffer).background({r: 255, g: 255, b: 255, alpha: 0}).flatten()
            .resize(460, 460).max().jpeg({quality: 80}).withoutEnlargement().toBuffer();
        await cdn.uploadBuffer(resizeBuffer, `link/${params.answerId}/460x460/preview.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

const createLinkAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.hasPreviewImage = typeof params.imageUrl === 'string';
    let user = await createLinkAnswerOriginalLinkCommand(params)
        .send([createLinkAnswerCommand(params),
            notification.addCreatedAnswerNotification(userId, params.answerId, params.created).getCommand()]);
    if (user[0].length === 1) {
        await uploadImages(params);
        logger.info(`Created link answer ${params.answerId} for question ${params.questionId}`);
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
            result.imageUrl = cdn.getPublicUrl(`link/${params.answerId}/460x460/preview.jpg`);
        }
        return result;
    }
    throw new exceptions.InvalidOperation(`Link answer ${params.link} exists already for question 
            ${params.questionId}`, ERROR_CODE_LINK_EXISTS_ALREADY);
};

module.exports = {
    createLinkAnswer
};
