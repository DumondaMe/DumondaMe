'use strict';

const dashify = require('dashify');
const db = requireDb();
const topics = require('./../../util/topics');
const regionSecurity = require('./../../region/security');
const image = require(`./image`);
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createCommitment = async function (userId, params, titlePath) {
    params.answerId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.website = params.website || null;
    topics.normalizeTopics(params.topics);
    regionSecurity.checkOnlyInternational(params.regions);
    await regionSecurity.checkRegionsExists(params.regions);
    await db.cypher().match("(user:User {userId: {userId}})")
        .create(`(commitment:Answer:Commitment {answerId: {answerId}, title: {title}, description: {description}, 
                  language: {lang}, website: {website}, created: {created}})`)
        .merge(`(user)-[:IS_ADMIN]->(commitment)`)
        .with(`commitment`)
        .match(`(region:Region)`)
        .where(`region.code IN {regions}`)
        .merge(`(region)<-[:BELONGS_TO_REGION]-(commitment)`)
        .with(`commitment`)
        .foreach(`(topic IN {topics} | MERGE (:Topic {name: topic}))`)
        .with(`commitment`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(commitment)`)
        .end(params).send();
    logger.info(`Created commitment with id ${params.answerId}`);

    await image.uploadTitleImage(titlePath, params.answerId);

    return {answerId: params.answerId, slug: dashify(params.title)};
};

module.exports = {
    createCommitment
};
