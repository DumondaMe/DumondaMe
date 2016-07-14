'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createContactConnection = function (userId, contactId, type) {
    if(!type) {
        type = 'Freund';
    }
    dbConnectionHandling.getCommands().push(db.cypher().match("(a:User {userId: {userId}}), (b:User {userId: {contactId}})")
        .create("(a)-[:IS_CONTACT {type: {type}}]->(b)").end({userId: userId, contactId: contactId, type: type}).getCommand());
};

module.exports = {
    createContactConnection: createContactConnection
};