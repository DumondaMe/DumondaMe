'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

let getEventMessages = function (events) {
    let result = [];
    events.forEach(function (event) {
        result.push({
            eventId: event.event.eventId,
            title: event.event.title,
            startDate: event.event.startDate,
            where: event.address.description,
        });
    });
    return result;
};

let getTotalNumberOfEvents = function (pageId, actual) {

    return db.cypher().match(`(:Page {pageId: {pageId}})-[:EVENT]->(event:Event)`)
        .where("(event.startDate > {now} AND {actual} = true) OR (event.startDate < {now} AND {actual} = false)")
        .return("count(*) AS totalNumberOfEvents")
        .end({pageId: pageId, now: time.getNowUtcTimestamp(), actual: actual}).getCommand();
};

let getOrder = function (actual) {
    if (actual) {
        return "event.startDate";
    }
    return "event.startDate DESC";
};

let getEventOverview = function (userId, requestParams) {

    let commands = [];

    commands.push(getTotalNumberOfEvents(requestParams.pageId, true));
    commands.push(getTotalNumberOfEvents(requestParams.pageId, false));

    return db.cypher().match(`(:Page {pageId: {pageId}})-[:EVENT]->(event:Event)-[:HAS]->(address:Address)`)
        .where("(event.startDate > {now} AND {actual} = true) OR (event.startDate < {now} AND {actual} = false)")
        .return("event, address")
        .orderBy(getOrder(requestParams.actual))
        .skip("{skip}")
        .limit("{limit}")
        .end({
            pageId: requestParams.pageId, actual: requestParams.actual, skip: requestParams.skip, limit: requestParams.maxItems,
            now: time.getNowUtcTimestamp()
        }).send(commands).then(function (resp) {

            return {
                totalNumberActualEvents: resp[0][0].totalNumberOfEvents, totalNumberPastEvents: resp[1][0].totalNumberOfEvents,
                events: getEventMessages(resp[2])
            };
        });
};

module.exports = {
    getEventOverview: getEventOverview
};
