'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let parser = require('./iCalEventParser');


let importLocation = function (uidEvent, address, geo) {
    return db.cypher().match(`(event:Event:ImportTC {uid: {uid}})`)
        .optionalMatch(`(event)-[rel:HAS]->(:Address)`)
        .delete(`rel`)
        .with(`event`)
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
    let event = parser.parseEvent(iCal);
    return await importEvent(uidEvent, event).send(
        [importLocation(uidEvent, event.location, event.geo)]);
};

module.exports = {
    importEvent: importModifiedEvent
};
