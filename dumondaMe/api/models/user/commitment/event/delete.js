'use strict';

const db = requireDb();
const eventSecurity = require('./security');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const deleteEvent = async function (userId, eventId) {
    await eventSecurity.isAdmin(userId, eventId);
    await db.cypher()
        .match(`(event:Event {eventId: {eventId}})<-[eventRel:EVENT]-(:Commitment)
                 <-[:IS_ADMIN]-(:User {userId: {userId}})`)
        .match(`(event)-[relRegion:BELONGS_TO_REGION]->(:Region)`)
        .delete(`relRegion, eventRel, event`)
        .end({userId, eventId}).send();

    logger.info(`Delete event with id ${eventId}`);
};

module.exports = {
    deleteEvent
};
