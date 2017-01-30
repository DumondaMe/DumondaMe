'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let _ = require('underscore');
let time = require('elyoos-server-lib').time;
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

let checkAllowedToEditPageEvent = function (params, userId, req) {
    if (params.endDate < params.startDate) {
        return exceptions.getInvalidOperation(`Start date ${params.startDate} before end date ${params.endDate}`, logger, req);
    } else if (params.startDate < time.getNowUtcTimestamp()) {
        return exceptions.getInvalidOperation(`Start date ${params.startDate} ist in the past`, logger, req);
    }
    params.genericPageId = params.genericPageId || null;
    params.existingAddressId = params.existingAddressId || null;
    return db.cypher().match("(page:Page)-[:EVENT]->(:Event {eventId: {eventId}}), (user:User {userId: {userId}})")
        .optionalMatch("(page)-[:HAS]->(address:Address {addressId: {existingAddressId}})")
        .optionalMatch("(page)<-[isAdminRel:IS_ADMIN]-(user)")
        .return("page, address, isAdminRel")
        .end({eventId: params.eventId, existingAddressId: params.existingAddressId, userId: userId}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`Invalid eventId ${params.eventId}`, logger, req);
            } else if (!resp[0].hasOwnProperty('address') && _.isString(params.existingAddressId)) {
                return exceptions.getInvalidOperation(`Address for id ${params.existingAddressId} does not exist`, logger, req);
            } else if (!resp[0].hasOwnProperty('isAdminRel')) {
                return exceptions.getInvalidOperation(`User ${userId} ist not admin of page ${resp[0].page.pageId}`, logger, req);
            }
        });
};

let checkAllowedToDeletePageEvent = function (userId, eventId, req) {

    let commands = [];

    function userNotAdmin(resp) {
        return resp.length === 0;
    }

    return db.cypher()
        .match("(event:Event {eventId: {eventId}})<-[:EVENT]-(:Page)<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .return("event.eventId AS eventId")
        .end({userId: userId, eventId: eventId}).send(commands)
        .then(function (resp) {
            if (userNotAdmin(resp)) {
                return exceptions.getInvalidOperation(`User tried to delete an event where he is not admin ${eventId}`, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToAddEvent: checkAllowedToAddEvent,
    checkAllowedToEditPageEvent: checkAllowedToEditPageEvent,
    checkAllowedToDeletePageEvent: checkAllowedToDeletePageEvent
};
