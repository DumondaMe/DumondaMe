'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let placeElements = require('./../placeElements');
let security = require('./../securityEvent');

let createEvent = function (userId, params, req) {
    placeElements.addPlaceElements(params);
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    return security.checkAllowedToAddEvent(params, userId, req).then(function () {
        return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'})")
            .createUnique(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                            created: {created}, endDate: {endDate}})-[:HAS]->(:Address {description: {addressDescription}, 
                            latitude: toFloat({addressLat}), longitude: toFloat({addressLng}), addressId: {addressId}})`)
            .end(params).send();
    }).then(function () {
        return {eventId: params.eventId, where: params.addressDescription};
    });
};

let createEventWithExistingAddress = function (userId, params, req) {
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    return security.checkAllowedToAddEvent(params, userId, req).then(function () {
        return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'}), (address:Address {addressId: {existingAddressId}})")
            .createUnique(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                            created: {created}, endDate: {endDate}})-[:HAS]->(address)`)
            .return("address.description AS where").end(params).send();
    }).then(function (resp) {
        return {eventId: params.eventId, where: resp[0].where};
    });
};

module.exports = {
    createEvent: createEvent,
    createEventWithExistingAddress: createEventWithExistingAddress
};
