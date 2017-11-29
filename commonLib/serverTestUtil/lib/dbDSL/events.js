'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createPageEventNewAddress = function (pageId, eventData, address) {
    address.description = address.description || null;
    eventData.modified = eventData.modified || 700;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .create(`(page)-[:EVENT]->(:Event {eventId: {eventId}, uid: {uid}, title: {title}, description: {description}, startDate: {startDate}, 
                  endDate: {endDate}, modified: {modified}})-[:HAS]->(:Address {addressId: {addressId}, address: {address}, description: {addressDescription},
                  latitude: {addressLatitude}, longitude: {addressLongitude}})`)
        .end({
            pageId: pageId, eventId: eventData.eventId, uid: `${eventData.eventId}@elyoos.org`, title: eventData.title, description: eventData.description,
            startDate: eventData.startDate, endDate: eventData.endDate, modified: eventData.modified, addressId: address.addressId,
            addressDescription: address.description, address: address.address, addressLatitude: address.lat, addressLongitude: address.lng,
        }).getCommand());
};

let createPageEventExistingAddress = function (pageId, eventData, addressId) {
    eventData.linkDescription = eventData.linkDescription || null;
    eventData.modified = eventData.modified || 700;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(page:Page {pageId: {pageId}}), (address:Address {addressId: {addressId}})`)
        .create(`(page)-[:EVENT]->(:Event {eventId: {eventId}, uid: {uid}, title: {title}, description: {description}, startDate: {startDate}, 
                  endDate: {endDate}, linkDescription: {linkDescription}, modified: {modified}})-[:HAS]->(address)`)
        .end({
            pageId: pageId, eventId: eventData.eventId, uid: `${eventData.eventId}@elyoos.org`, title: eventData.title, description: eventData.description,
            startDate: eventData.startDate, endDate: eventData.endDate, modified: eventData.modified,
            linkDescription: eventData.linkDescription, addressId: addressId
        }).getCommand());
};

module.exports = {
    createPageEventNewAddress: createPageEventNewAddress,
    createPageEventExistingAddress: createPageEventExistingAddress
};