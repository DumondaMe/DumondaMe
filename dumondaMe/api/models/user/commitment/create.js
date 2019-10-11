'use strict';

const slug = require('limax');
const db = requireDb();
const topicsSecurity = require('./../../topic/security');
const regionSecurity = require('./../../region/security');
const harvestingUser = require('./../../userHarvesting/security');
const titleImage = require(`./image`);
const image = require('dumonda-me-server-lib').image;
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const createCommitment = async function (userId, params, titlePath) {
    params.commitmentId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.website = params.website || null;
    regionSecurity.checkOnlyInternational(params.regions);
    await topicsSecurity.checkTopicsExists(params.topics);
    await regionSecurity.checkRegionsExists(params.regions);
    await harvestingUser.notAllowedToPerformAction(userId, logger);
    await image.checkImageMinWidth(titlePath, 460);
    await db.cypher().match("(user:User {userId: {userId}})")
        .create(`(commitment:Commitment {commitmentId: {commitmentId}, title: {title}, description: {description}, 
                  language: {lang}, website: {website}, created: {created}})`)
        .merge(`(user)-[:IS_ADMIN]->(commitment)`)
        .merge(`(user)-[:IS_CREATOR]->(commitment)`)
        .with(`commitment`)
        .match(`(region:Region)`)
        .where(`region.regionId IN {regions}`)
        .merge(`(region)<-[:BELONGS_TO_REGION]-(commitment)`)
        .with(`commitment`)
        .match(`(topic:Topic)`)
        .where(`topic.topicId IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(commitment)`)
        .end(params).send();
    logger.info(`Created commitment with id ${params.commitmentId}`);

    await titleImage.uploadTitleImage(titlePath, params.commitmentId, true);

    return {commitmentId: params.commitmentId, slug: slug(params.title)};
};

module.exports = {
    createCommitment
};
