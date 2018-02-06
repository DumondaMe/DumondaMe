'use strict';

const db = requireDb();
const Promise = require('bluebird');
const rp = require('request');
const sharp = require('sharp');
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const ERROR_CODE_LINK_EXISTS_ALREADY = 2;

const uploadPreviewImage = async function (answerId, url) {
    try {
        await new Promise(function (resolve, reject) {
            if (url) {
                rp.get(url, function (err) {
                    if (err) {
                        reject(err);
                    }
                }).pipe(sharp().resize(500, 500).max().toFormat('jpeg')
                    .withoutEnlargement().toBuffer(async function (err, buffer) {
                        if (err) {
                            reject(err);
                        }
                        await cdn.uploadBuffer(buffer, `link/${answerId}/preview.jpg`, process.env.BUCKET_PUBLIC);
                        resolve();
                    }));
            } else {
                resolve();
            }
        });
    } catch (error) {
        logger.error(`Failed to get image ${url}`, error);
    }
};

const createLinkAnswerCommand = function (params) {
    return db.cypher().match("(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})")
        .where(`NOT (question)-[:ANSWER]->(:Link {link: {link}})`)
        .create(`(answer:Link:Answer {answerId: {answerId}, link: {link}, created: {created}, title: {title},
                      description: {description}, type: {type}, hasPreviewImage: {hasPreviewImage}})`)
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

const createLinkAnswer = async function (userId, params) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.hasPreviewImage = typeof params.imageUrl === 'string';
    let user = await createLinkAnswerOriginalLinkCommand(params).send([createLinkAnswerCommand(params)]);
    if (user[0].length === 1) {
        await uploadPreviewImage(params.answerId, params.imageUrl);
        logger.info(`Created link answer ${params.answerId} for question ${params.questionId}`);
        const result = {
            answerId: params.answerId, created: params.created,
            creator: {name: user[0][0].name, thumbnailUrl: cdn.getSignedUrl(`profileImage/${userId}/thumbnail.jpg`)}
        };
        if (params.imageUrl) {
            result.imageUrl = cdn.getPublicUrl(`120x120/link/${params.answerId}/preview.jpg`);
        }
        return result;
    }
    throw new exceptions.InvalidOperation(`Link answer ${params.link} exists already for question 
            ${params.questionId}`, ERROR_CODE_LINK_EXISTS_ALREADY);
};

module.exports = {
    createLinkAnswer
};
