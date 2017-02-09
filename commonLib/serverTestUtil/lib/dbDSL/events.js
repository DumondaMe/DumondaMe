'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createPageEventNewAddress = function (pageId, eventData, address) {
    address.description = address.description || null;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .create(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                  endDate: {endDate}})-[:HAS]->(:Address {addressId: {addressId}, address: {address}, description: {addressDescription},
                  latitude: {addressLatitude}, longitude: {addressLongitude}})`)
        .end({
            pageId: pageId, eventId: eventData.eventId, title: eventData.title, description: eventData.description, startDate: eventData.startDate,
            endDate: eventData.endDate, addressId: address.addressId, addressDescription: address.description, address: address.address,
            addressLatitude: address.lat, addressLongitude: address.lng,
        }).getCommand());
};

let createPageEventExistingAddress = function (pageId, eventData, addressId) {
    eventData.linkDescription = eventData.linkDescription || null;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(page:Page {pageId: {pageId}}), (address:Address {addressId: {addressId}})`)
        .create(`(page)-[:EVENT]->(:Event {eventId: {eventId}, title: {title}, description: {description}, startDate: {startDate}, 
                  endDate: {endDate}, linkDescription: {linkDescription}})-[:HAS]->(address)`)
        .end({
            pageId: pageId, eventId: eventData.eventId, title: eventData.title, description: eventData.description, startDate: eventData.startDate,
            endDate: eventData.endDate, linkDescription: eventData.linkDescription, addressId: addressId
        }).getCommand());
};

module.exports = {
    createPageEventNewAddress: createPageEventNewAddress,
    createPageEventExistingAddress: createPageEventExistingAddress
};