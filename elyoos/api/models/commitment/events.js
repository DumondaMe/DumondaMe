'use strict';

const db = requireDb();
const time = require('elyoos-server-lib').time;

const PAGE_SIZE = 7;

const getUpcomingFilter = function (upComing) {
    if (upComing) {
        return `event.endDate > {now}`;
    }
    return `event.endDate < {now}`;
};

const getEventsCommand = function (commitmentId, upComing, page) {
    let skip = PAGE_SIZE * page;
    return db.cypher()
        .match(`(:Commitment {commitmentId: {commitmentId}})-[:EVENT]->(event:Event)-[:BELONGS_TO_REGION]->(r:Region)`)
        .where(getUpcomingFilter(upComing))
        .return(`event.eventId AS eventId, event.title AS title, event.description AS description, 
                 event.startDate AS startDate, event.endDate AS endDate, event.created AS created, 
                 event.modified AS modified, event.location AS location, r.code AS region`)
        .orderBy(`startDate`)
        .skip(`{skip}`)
        .limit(`{pageSize}`)
        .end({commitmentId, skip, pageSize: PAGE_SIZE, now: time.getNowUtcTimestamp()});
};

const getEvents = async function (commitmentId, upComing, page) {
    let resp = await getEventsCommand(commitmentId, upComing, page).send();
    return {events: resp};
};

module.exports = {
    getEventsCommand,
    getEvents
};
