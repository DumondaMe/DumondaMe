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

const getEventsCommand = function (commitmentId, upComing, page, language) {
    let skip = PAGE_SIZE * page;
    return db.cypher()
        .match(`(:Commitment {commitmentId: {commitmentId}})-[:EVENT]->(event:Event)-[:BELONGS_TO_REGION]->(r:Region)`)
        .where(getUpcomingFilter(upComing))
        .return(`event.eventId AS eventId, event.title AS title, event.description AS description, 
                 event.startDate AS startDate, event.endDate AS endDate, event.created AS created, 
                 event.modified AS modified, event.location AS location, r.${language} AS region,
                 event.linkDescription AS linkDescription`)
        .orderBy(`startDate`)
        .skip(`{skip}`)
        .limit(`{pageSize}`)
        .end({commitmentId, skip, pageSize: PAGE_SIZE, now: time.getNowUtcTimestamp()});
};

const getTotalNumberOfEventsCommand = function (commitmentId, upComing) {
    return db.cypher()
        .match(`(:Commitment {commitmentId: {commitmentId}})-[:EVENT]->(event:Event)`)
        .where(getUpcomingFilter(upComing))
        .return(`COUNT(DISTINCT event) AS numberOfEvents`)
        .end({commitmentId, now: time.getNowUtcTimestamp()});
};

const getEvents = async function (commitmentId, upComing, page, language) {
    let resp = await getEventsCommand(commitmentId, upComing, page, language)
        .send([getTotalNumberOfEventsCommand(commitmentId, upComing).getCommand()]);
    return {events: resp[1], totalNumberOfEvents: resp[0][0].numberOfEvents};
};

module.exports = {
    getEventsCommand,
    getTotalNumberOfEventsCommand,
    getEvents
};
