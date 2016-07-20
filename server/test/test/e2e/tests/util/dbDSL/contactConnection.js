'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createContactConnection = function (userId, contactId, type, contactAdded) {
    if (!type) {
        type = 'Freund';
    }
    contactAdded = contactAdded || null;
    dbConnectionHandling.getCommands().push(db.cypher().match("(a:User {userId: {userId}}), (b:User {userId: {contactId}})")
        .create("(a)-[:IS_CONTACT {type: {type}, contactAdded: {contactAdded}}]->(b)").end({
            userId: userId, contactId: contactId,
            contactAdded: contactAdded, type: type
        }).getCommand());
};

module.exports = {
    createContactConnection: createContactConnection
};