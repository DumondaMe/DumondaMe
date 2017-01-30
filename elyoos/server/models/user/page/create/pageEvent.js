'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let _ = require('lodash');
let time = require('elyoos-server-lib').time;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAllowedToAddEvent = function (params, userId, req) {
    if (params.endDate < params.startDate) {
        return exceptions.getInvalidOperation(`Start date ${params.startDate} before end date ${params.endDate}`, logger, req);
    } else if (params.startDate < time.getNowUtcTimestamp()) {
        return exceptions.getInvalidOperation(`Start date ${params.startDate} ist in the past`, logger, req);
    }
    params.genericPageId = params.genericPageId || null;
    params.existingAddressId = params.existingAddressId || null;
    return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'}), (user:User {userId: {userId}})")
        .optionalMatch("(page)-[:HAS]->(address:Address {addressId: {existingAddressId}})")
        .optionalMatch("(page)<-[isAdminRel:IS_ADMIN]-(user)")
        .return("page, address, isAdminRel")
        .end({genericPageId: params.genericPageId, existingAddressId: params.existingAddressId, userId: userId}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`Invalid page to add event ${params.genericPageId}`, logger, req);
            } else if (!resp[0].hasOwnProperty('address') && _.isString(params.existingAddressId)) {
                return exceptions.getInvalidOperation(`Address for id ${params.existingAddressId} does not exist`, logger, req);
            } else if (!resp[0].hasOwnProperty('isAdminRel')) {
                return exceptions.getInvalidOperation(`User ${userId} ist not admin of page ${resp[0].page.pageId}`, logger, req);
            }
        });
};

let addPlaceElements = function (params) {
    params.addressId = uuid.generateUUID();
    params.addressDescription = params.address.description;
    params.addressLat = params.address.lat;
    params.addressLng = params.address.lng;
};

let createEvent = function (userId, params, req) {
    addPlaceElements(params);
    params.eventId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    return checkAllowedToAddEvent(params, userId, req).then(function () {
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
    return checkAllowedToAddEvent(params, userId, req).then(function () {
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
