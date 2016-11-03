'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createKeywords = function (name) {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Keyword {de: {name}})`)
        .end({name: name}).getCommand());
};

module.exports = {
    createKeywords: createKeywords
};