'use strict';

let db = requireDb();
let security = require('./../securityEvent');
let time = require('elyoos-server-lib').time;
let placeElements = require('./../placeElements');

let getEditCommand = function (params) {
    return db.cypher().match("(page:Page)-[:EVENT]->(event:Event {eventId: {eventId}})")
        .set('event', {
            title: params.title,
            description: params.description,
            modified: params.modified,
            startDate: params.startDate,
            endDate: params.endDate
        })
        .with("page, event")
        .optionalMatch("(event)-[:HAS]->(addressToDelete:Address)")
        .where("NOT (addressToDelete)<-[:HAS]-(page)")
        .optionalMatch("(event)-[relAddress:HAS]->(:Address)")
        .delete("addressToDelete, relAddress")
        .with("event");
};

let editEvent = function (userId, params, req) {
    placeElements.addPlaceElements(params);
    params.modified = time.getNowUtcTimestamp();
    return security.checkAllowedToEditPageEvent(params, userId, req).then(function () {
        return getEditCommand(params)
            .createUnique(`(event)-[:HAS]->(:Address {description: {addressDescription}, 
                            latitude: toFloat({addressLat}), longitude: toFloat({addressLng}), addressId: {addressId}})`)
            .end(params).send();
    }).then(function () {
        return {where: params.addressDescription};
    });
};

let editEventWithExistingAddress = function (userId, params, req) {
    params.modified = time.getNowUtcTimestamp();
    return security.checkAllowedToEditPageEvent(params, userId, req).then(function () {
        return getEditCommand(params)
            .match("(address:Address {addressId: {existingAddressId}})")
            .createUnique("(event)-[:HAS]->(address)")
            .return("address.description AS where").end(params).send();
    }).then(function (resp) {
        return {eventId: params.eventId, where: resp[0].where};
    });
};

module.exports = {
    editEvent: editEvent,
    editEventWithExistingAddress: editEventWithExistingAddress
};
