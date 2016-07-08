'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createContactConnection = function (userId, contactId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(a:User {userId: {userId}}), (b:User {userId: {contactId}})")
        .create("(a)-[:IS_CONTACT]->(b)").end({userId: userId, contactId: contactId}).getCommand());
};

module.exports = {
    createContactConnection: createContactConnection
};