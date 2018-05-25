'use strict';

const db = requireDb();
const time = require('elyoos-server-lib').time;

const getEventsCommand = function (commitmentId) {
    return db.cypher()
        .match(`(:Commitment {commitmentId: {commitmentId}})-[:EVENT]->(event:Event)-[:BELONGS_TO_REGION]->(r:Region)`)
        .where(`event.endDate > {now}`)
        .match(`(t:Topic)-[:TOPIC]->(event)`)
        .return(`event.eventId AS eventId, event.title AS title, event.description AS description, 
                 event.startDate AS startDate, event.endDate AS endDate, event.created AS created, 
                 event.modified AS modified, event.location AS location, 
                 collect(DISTINCT t.name) AS topics, r.code AS region`)
        .end({commitmentId, now: time.getNowUtcTimestamp()}).getCommand();
};

module.exports = {
    getEventsCommand
};
