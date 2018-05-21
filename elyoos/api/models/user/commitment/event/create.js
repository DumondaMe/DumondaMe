'use strict';

const db = requireDb();
const regionSecurity = require('./../../../region/security');
const topicSecurity = require('./../../../topic/security');
const commitmentSecurity = require('./../security');
const uuid = require('elyoos-server-lib').uuid;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createEvent = async function (userId, params) {
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.linkDescription = params.linkDescription || null;
    await regionSecurity.checkRegionsExists([params.region]);
    await topicSecurity.checkTopicsExists(params.topics);
    await commitmentSecurity.isAdmin(userId, params.commitmentId);
    await db.cypher()
        .match("(:User {userId: {userId}})-[:IS_ADMIN]->(commitment:Commitment {commitmentId: {commitmentId}})")
        .create(`(event:Event {eventId: {eventId}, title: {title}, description: {description}, location: {location}, 
                  startDate: {startDate}, endDate: {endDate}, linkDescription: {linkDescription}, 
                  created: {created}})`)
        .merge(`(commitment)-[:EVENT]->(event)`)
        .with(`event`)
        .match(`(region:Region {code: {region}})`)
        .merge(`(region)<-[:BELONGS_TO_REGION]-(event)`)
        .with(`event`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(event)<-[:TOPIC]-(topic)`)
        .end(params).send();

    logger.info(`Created event with id ${params.eventId}`);

    return {eventId: params.eventId};
};

module.exports = {
    createEvent
};
