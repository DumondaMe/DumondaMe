'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAllowedToEditPageEvent = function (userId, pageId, req) {

    function userNotAllowedToEditPage(resp) {
        return resp.length === 0;
    }

    return db.cypher()
        .match("(page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .return("user.userId AS userId")
        .end({userId: userId, pageId: pageId}).send()
        .then(function (resp) {
            if (userNotAllowedToEditPage(resp)) {
                return exceptions.getInvalidOperation('User tried to edit page with no Admin rights ' + pageId, logger, req);
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
    checkAllowedToEditPageEvent: checkAllowedToEditPageEvent,
    checkAllowedToDeletePageEvent: checkAllowedToDeletePageEvent
};
