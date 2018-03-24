'use strict';

const dashify = require('dashify');
const sharp = require('sharp');
const db = requireDb();
const topics = require('./../../util/topics');
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const cdn = require('elyoos-server-lib').cdn;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const uploadTitleImage = async function (titlePath, answerId) {
    if (typeof titlePath === 'string') {
        let buffer = await sharp(titlePath).resize(400).max().jpeg({quality: 93}).toBuffer();
        await cdn.uploadBuffer(buffer, `commitment/${answerId}/title.jpg`, process.env.BUCKET_PUBLIC);
        logger.info(`Uploaded title image for commitment ${answerId}`);
    } else {
        await cdn.copyFile(`default/commitment/title.jpg`, `commitment/${answerId}/title.jpg`,
            process.env.BUCKET_PUBLIC);
    }
};

const createCommitment = async function (userId, params, titlePath) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.website = params.website || null;
    topics.normalizeTopics(params.topics);
    await db.cypher().match("(user:User {userId: {userId}})")
        .create(`(commitment:Answer:Commitment {answerId: {answerId}, title: {title}, description: {description}, 
                  language: {lang}, website: {website}, created: {created}})`)
        .merge(`(user)-[:IS_ADMIN]->(commitment)`)
        .foreach(`(topic IN {topics} | MERGE (:Topic {name: topic}))`)
        .with(`commitment`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(commitment)`)
        .end(params).send();
    logger.info(`Created commitment with id ${params.answerId}`);

    await uploadTitleImage(titlePath, params.answerId);

    return {answerId: params.answerId, slug: dashify(params.title)};
};

module.exports = {
    createCommitment
};
