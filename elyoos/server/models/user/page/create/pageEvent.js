'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let placeElements = require('./../placeElements');
let security = require('./../securityEvent');

let createTcEventExportCommand = function (params) {
    return db.cypher().match(`(event:Event {eventId: {eventId}})<-[:EVENT]-(page:Page {pageId: {genericPageId}, label: 'Generic'})
                        <-[:EXPORT_TO_TC|STOP_EXPORT_TO_TC]-(tcExport:TransitionConnectExport)`)
        .merge(`(event)<-[tcExportRel:EXPORT_EVENT_TO_TC]-(tcExport)`)
        .onCreate(`SET tcExportRel.timestampExportStarted = {created}`)
        .end(params);
};

let createEventCommand = function (params) {
    return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'})")
        .createUnique(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                            created: {created}, modified: {created}, endDate: {endDate}, linkDescription: {linkDescription}})-[:HAS]->
                            (address:Address {description: {addressDescription}, address: {addressAddress}, latitude: toFloat({addressLat}), 
                            longitude: toFloat({addressLng}), addressId: {addressId}})`)
        .return("address").end(params).getCommand();
};

let createEvent = function (userId, params, req) {
    placeElements.addPlaceElements(params);
    params.linkDescription = params.linkDescription || null;
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    return security.checkAllowedToAddEvent(params, userId, req).then(function () {
        return createTcEventExportCommand(params)
            .send([createEventCommand(params)]);
    }).then(function (resp) {
        return {eventId: params.eventId, address: resp[0][0].address};
    });
};


let createEventWithExistingAddressCommand = function (params) {
    return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'}), (address:Address {addressId: {existingAddressId}})")
        .createUnique(`(page)-[:EVENT]->(event:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                            created: {created}, modified: {created}, endDate: {endDate}, linkDescription: {linkDescription}})-[:HAS]->(address)`)
        .return("address").end(params).getCommand();
};

let createEventWithExistingAddress = function (userId, params, req) {
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.linkDescription = params.linkDescription || null;
    return security.checkAllowedToAddEvent(params, userId, req).then(function () {
        return createTcEventExportCommand(params)
            .send([createEventWithExistingAddressCommand(params)]);
    }).then(function (resp) {
        return {eventId: params.eventId, address: resp[0][0].address};
    });
};

module.exports = {
    createEvent: createEvent,
    createEventWithExistingAddress: createEventWithExistingAddress
};
