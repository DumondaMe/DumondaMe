'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let placeElements = require('./../placeElements');
let security = require('./../securityEvent');

let createEvent = function (userId, params, req) {
    placeElements.addPlaceElements(params);
    params.linkDescription = params.linkDescription || null;
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    return security.checkAllowedToAddEvent(params, userId, req).then(function () {
        return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'})")
            .createUnique(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                            created: {created}, endDate: {endDate}, linkDescription: {linkDescription}})-[:HAS]->
                            (address:Address {description: {addressDescription}, address: {addressAddress}, latitude: toFloat({addressLat}), 
                            longitude: toFloat({addressLng}), addressId: {addressId}})`)
            .return("address")
            .end(params).send();
    }).then(function (resp) {
        return {eventId: params.eventId, address: resp[0].address};
    });
};

let createEventWithExistingAddress = function (userId, params, req) {
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.linkDescription = params.linkDescription || null;
    return security.checkAllowedToAddEvent(params, userId, req).then(function () {
        return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'}), (address:Address {addressId: {existingAddressId}})")
            .createUnique(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                            created: {created}, endDate: {endDate}, linkDescription: {linkDescription}})-[:HAS]->(address)`)
            .return("address").end(params).send();
    }).then(function (resp) {
        return {eventId: params.eventId, address: resp[0].address};
    });
};

module.exports = {
    createEvent: createEvent,
    createEventWithExistingAddress: createEventWithExistingAddress
};
