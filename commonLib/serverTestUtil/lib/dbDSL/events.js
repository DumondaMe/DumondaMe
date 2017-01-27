'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createPageEventNewAddress = function (pageId, eventData, address) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .create(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                  endDate: {endDate}})-[:HAS]->(:Address {addressId: {addressId}, description: {addressDescription},
                  latitude: {addressLatitude}, longitude: {addressLongitude}})`)
        .end({
            pageId: pageId, eventId: eventData.eventId, title: eventData.title, description: eventData.description, startDate: eventData.startDate,
            endDate: eventData.endDate, addressId: address.addressId, addressDescription: address.description,
            addressLatitude: address.lat, addressLongitude: address.lng,
        }).getCommand());
};

let createPageEventExistingAddress = function (pageId, eventData, addressId) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(page:Page {pageId: {pageId}}), (address:Address {addressId: {addressId}})`)
        .create(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                  endDate: {endDate}})-[:HAS]->(address)`)
        .end({
            pageId: pageId, eventId: eventData.eventId, title: eventData.title, description: eventData.description, startDate: eventData.startDate,
            endDate: eventData.endDate, addressId: addressId
        }).getCommand());
};

module.exports = {
    createPageEventNewAddress: createPageEventNewAddress,
    createPageEventExistingAddress: createPageEventExistingAddress
};