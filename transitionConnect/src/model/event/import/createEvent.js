'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let parser = require('./iCalEventParser');


let importLocation = function (uidEvent, address, geo) {
    return db.cypher().match(`(event:Event:ImportTC {uid: {uid}})`)
        .create(`(address:Address {addressId: {addressId}, address: {address},
                  latitude: {latitude}, longitude: {longitude}})`)
        .merge(`(event)-[:HAS]->(address)`)
        .end({
            uid: uidEvent, addressId: uuid.generateUUID(), address: address,
            latitude: geo.latitude, longitude: geo.longitude
        });
};

let importEvent = function (orgId, event) {
    return db.cypher().match(`(org:Page {pageId: {orgId}})`)
        .where(`org:ImportTC OR EXISTS((org)<-[:EXPORT_TO_TC]-(:TransitionConnectExport))`)
        .create(`(event:Event:ImportTC {eventId: {eventId}, uid: {uid}, title: {title}, 
                 description: {description}, endDate: {endDate}, startDate: {startDate}, 
                 created: {created}, modified: {created}})`)
        .merge(`(org)-[:EVENT]->(event)`)
        .end({
            orgId: orgId, eventId: uuid.generateUUID(), uid: event.uid, title: event.summary,
            description: event.description, endDate: event.endDate,
            startDate: event.startDate, created: time.getNowUtcTimestamp()
        });
};

let sendCommand = async function (orgId, event) {
    if (event.location && event.geo && event.geo.latitude) {
        return await importLocation(event.uid, event.location, event.geo).send(
            [importEvent(orgId, event).getCommand()]);
    } else {
        return await importEvent(orgId, event).send();
    }
};

let importNewEvent = async function (orgId, iCal) {
    let event = parser.parseEvent(iCal);
    return await sendCommand(orgId, event);
};

module.exports = {
    importEvent: importNewEvent
};
