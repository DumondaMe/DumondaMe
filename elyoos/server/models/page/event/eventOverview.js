'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

let getEventMessages = function (events) {
    let result = [];
    events.forEach(function (event) {
        result.push({
            eventId: event.event.eventId,
            title: event.event.title,
            description: event.event.description,
            startDate: event.event.startDate,
            endDate: event.event.endDate,
            address: event.address,
        });
    });
    return result;
};

let getTotalNumberOfEvents = function (pageId, actual) {

    return db.cypher().match(`(:Page {pageId: {pageId}})-[:EVENT]->(event:Event)`)
        .where("(event.endDate > {now} AND {actual} = true) OR (event.endDate < {now} AND {actual} = false)")
        .return("count(*) AS totalNumberOfEvents")
        .end({pageId: pageId, now: time.getNowUtcTimestamp(), actual: actual}).getCommand();
};

let getOrder = function (actual) {
    if (actual) {
        return "event.startDate";
    }
    return "event.endDate DESC";
};

let getEventOverview = function (userId, requestParams) {

    let commands = [];

    commands.push(getTotalNumberOfEvents(requestParams.pageId, requestParams.actual));

    return db.cypher().match(`(:Page {pageId: {pageId}})-[:EVENT]->(event:Event)-[:HAS]->(address:Address)`)
        .where("(event.endDate > {now} AND {actual} = true) OR (event.endDate < {now} AND {actual} = false)")
        .return("event, address")
        .orderBy(getOrder(requestParams.actual))
        .skip("{skip}")
        .limit("{limit}")
        .end({
            pageId: requestParams.pageId, actual: requestParams.actual, skip: requestParams.skip, limit: requestParams.maxItems,
            now: time.getNowUtcTimestamp()
        }).send(commands).then(function (resp) {

            return {
                totalNumberOfEvents: resp[0][0].totalNumberOfEvents, events: getEventMessages(resp[1])
            };
        });
};

module.exports = {
    getEventOverview: getEventOverview
};
