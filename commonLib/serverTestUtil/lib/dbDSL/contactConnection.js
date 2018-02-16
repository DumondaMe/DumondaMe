'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createContactConnection = function (userId, contactId, type, contactAdded) {
    contactAdded = contactAdded || null;
    dbConnectionHandling.getCommands().push(db.cypher().match("(a:User {userId: {userId}}), (b:User {userId: {contactId}})")
        .create("(a)-[:IS_CONTACT {contactAdded: {contactAdded}}]->(b)").end({
            userId: userId, contactId: contactId,
            contactAdded: contactAdded
        }).getCommand());
};

module.exports = {
    createContactConnection: createContactConnection
};