'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let _ = require('underscore');
let time = require('elyoos-server-lib').time;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAddEditEvent = function (params, userId, req, matchQuery, invalidMessage, matchParam) {
    let paramsQuery;
    if (params.endDate < params.startDate) {
        return exceptions.getInvalidOperation(`Start date ${params.startDate} before end date ${params.endDate}`, logger, req);
    } else if (params.startDate < time.getNowUtcTimestamp()) {
        return exceptions.getInvalidOperation(`Start date ${params.startDate} ist in the past`, logger, req);
    }
    params.existingAddressId = params.existingAddressId || null;
    paramsQuery = {existingAddressId: params.existingAddressId, userId: userId};
    return db.cypher().match(matchQuery)
        .optionalMatch("(page)-[:HAS]->(address:Address {addressId: {existingAddressId}})")
        .optionalMatch("(page)<-[isAdminRel:IS_ADMIN]-(user)")
        .return("page, address, isAdminRel")
        .end(_.extend(paramsQuery, matchParam)).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(invalidMessage, logger, req);
            } else if (!resp[0].hasOwnProperty('address') && _.isString(params.existingAddressId)) {
                return exceptions.getInvalidOperation(`Address for id ${params.existingAddressId} does not exist`, logger, req);
            } else if (!resp[0].hasOwnProperty('isAdminRel')) {
                return exceptions.getInvalidOperation(`User ${userId} ist not admin of page ${resp[0].page.pageId}`, logger, req);
            }
        });
};

let checkAllowedToAddEvent = function (params, userId, req) {
    return checkAddEditEvent(params, userId, req, "(page:Page {pageId: {genericPageId}, label: 'Generic'}), (user:User {userId: {userId}})",
        `Invalid page to add event ${params.genericPageId}`, {genericPageId: params.genericPageId});
};

let checkAllowedToEditPageEvent = function (params, userId, req) {
    return checkAddEditEvent(params, userId, req, "(page:Page)-[:EVENT]->(:Event {eventId: {eventId}}), (user:User {userId: {userId}})",
        `Invalid eventId ${params.eventId}`, {eventId: params.eventId});
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
