'use strict';

let db = requireDb();
let time = require('dumonda-me-server-lib').time;
let uuid = require('dumonda-me-server-lib').uuid;
let parser = require('./iCalEventParser');


let deletePreviousLocation = function (uidEvent) {
    return db.cypher().match(`(event:Event:ImportTC {uid: {uid}})`)
        .optionalMatch(`(event)-[rel:HAS]->(address:Address)`)
        .delete(`rel, address`)
        .end({uid: uidEvent}).getCommand();
};

let importLocation = function (uidEvent, address, geo) {
    return db.cypher().match(`(event:Event:ImportTC {uid: {uid}})`)
        .create(`(address:Address {addressId: {addressId}, address: {address},
                  latitude: {latitude}, longitude: {longitude}})`)
        .merge(`(event)-[:HAS]->(address)`)
        .end({
            uid: uidEvent, addressId: uuid.generateUUID(), address: address,
            latitude: geo.latitude, longitude: geo.longitude
        }).getCommand();
};

let importEvent = function (uidEvent, event) {
    return db.cypher().match(`(event:Event:ImportTC {uid: {uid}})`)
        .set(`event`, {
            title: event.summary, description: event.description, endDate: event.endDate,
            startDate: event.startDate, modified: time.getNowUtcTimestamp()
        })
        .end({uid: uidEvent});
};

let importModifiedEvent = async function (uidEvent, iCal) {
    let event = parser.parseEvent(iCal), commands = [deletePreviousLocation(uidEvent)];
    if (event.location && event.geo && event.geo.latitude) {
        commands.push(importLocation(uidEvent, event.location, event.geo));
    }
    return await importEvent(uidEvent, event).send(commands);
};

module.exports = {
    importEvent: importModifiedEvent
};
