'use strict';

const db = requireDb();
const regionSecurity = require('./../../../region/security');
const eventSecurity = require('./security');
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const editEvent = async function (userId, params) {
    params.userId = userId;
    params.linkDescription = params.linkDescription || null;
    params.description = params.description || null;
    await regionSecurity.checkRegionsExists([params.regionId]);
    await eventSecurity.isAdmin(userId, params.eventId);
    await db.cypher()
        .match(`(event:Event {eventId: {eventId}})<-[:EVENT]-(:Commitment)<-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .set(`event`, {title: params.title, description: params.description, location: params.location,
            startDate: params.startDate, endDate: params.endDate, linkDescription: params.linkDescription,
            modified: time.getNowUtcTimestamp()})
        .with(`event`)
        .match(`(event)-[relRegion:BELONGS_TO_REGION]->(:Region)`)
        .delete(`relRegion`)
        .with(`event`)
        .match(`(region:Region {regionId: {regionId}})`)
        .merge(`(region)<-[:BELONGS_TO_REGION]-(event)`)
        .end(params).send();

    logger.info(`Edit event with id ${params.eventId}`);
};

module.exports = {
    editEvent
};
