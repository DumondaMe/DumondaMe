'use strict';

let db = requireDb();
let ical = require('ical-generator');
let moment = require('moment');
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

const BEGIN_EVENT = 'BEGIN:VEVENT';
const END_EVENT = 'END:VEVENT';

let addCategories = function (eventCal, topics) {
    let endIndex = eventCal.indexOf(END_EVENT);
    return `${eventCal.substring(0, endIndex)}CATEGORIES:${topics.join()}\r\n${eventCal.substring(endIndex)}`;
};

let addLocation = function (eventCal, address) {
    if(address) {
        let endIndex = eventCal.indexOf(END_EVENT);
        let tempCal = `${eventCal.substring(0, endIndex)}LOCATION:${address.address}\r\n`;
        return `${tempCal}GEO:${address.latitude},${address.longitude}\r\n${eventCal.substring(endIndex)}`;
    }
    return eventCal;
};

let getEventICalString = function (calString, topics, address) {
    let eventCal;
    let startIndex = calString.indexOf(BEGIN_EVENT);
    let endIndex = calString.indexOf(END_EVENT);
    if (startIndex !== -1 && endIndex !== -1) {
        eventCal = calString.substring(startIndex, endIndex + END_EVENT.length);
        eventCal = addCategories(eventCal, topics);
        eventCal = addLocation(eventCal, address);
    }
    return eventCal;
};

let exportEvent = async function (uid, req) {
    let resp = await db.cypher().match(`(org:Page)-[:EVENT]->(event:Event {uid: {uid}})`)
        .optionalMatch(`(event)-[:HAS]->(address:Address)`)
        .return(`org, event, address`).end({uid: uid}).send();
    if(resp.length === 1) {
        let cal = ical({domain: 'elyoos.org'}),
            event = resp[0].event, org = resp[0].org, address = resp[0].address;
        cal.createEvent({
            summary: event.title, uid: event.eventId,
            description: event.description,
            start: moment.utc(event.startDate * 1000).toDate(),
            end: moment.utc(event.endDate * 1000).toDate()
        });
        return {iCal: getEventICalString(cal.toString(), org.topic, address), idOrg: org.pageId};
    } else {
        return exceptions.getInvalidOperation(`Event ${uid} not found or more then one`, logger, req);
    }

};

let getListEvents = async function (skip) {
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_EVENT_TO_TC]->(event:Event)`)
        .return(`event.uid AS uid, event.modified AS timestamp`)
        .orderBy(`export.timestampExportStarted`)
        .skip(`{skip}`)
        .limit(`10000`)
        .end({skip: skip}).send();
    return {events: resp};
};

module.exports = {
    exportEvent,
    getListEvents
};
