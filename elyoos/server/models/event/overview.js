'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

let getEventResponse = function (resp) {
    let events = [];
    resp.forEach(function (element) {
        let event = {
            eventId: element.event.eventId,
            title: element.event.title,
            address: element.address.address,
            startDate: element.event.startDate,
            endDate: element.event.endDate,
        };
        events.push(event);
    });
    return events;
};

let getTotalNumberOfEvents = function (now) {
    return db.cypher().match("(event:Event)-[:HAS]->(:Address)")
        .where("event.startDate > {now}")
        .return("COUNT(*) AS numberOfEvents")
        .end({now: now}).getCommand();
};

let getOverview = function (userId, params) {
    let commands = [];
    params.now = time.getNowUtcTimestamp();

    commands.push(getTotalNumberOfEvents(params.now));
    return db.cypher().match("(event:Event)-[:HAS]->(address:Address)")
        .where("event.startDate > {now}")
        .return("event, address")
        .orderBy("event.startDate")
        .skip("{skip}")
        .limit("{maxItems}")
        .end(params).send(commands).then(function (resp) {
            return {numberOfTotalEvents: resp[0][0].numberOfEvents, events: getEventResponse(resp[1])};
        });
};

module.exports = {
    getOverview: getOverview
};
