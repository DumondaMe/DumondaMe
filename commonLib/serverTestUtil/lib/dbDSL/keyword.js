'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createKeywords = function (name) {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Keyword {de: {name}})`)
        .end({name: name}).getCommand());
};

module.exports = {
    createKeywords: createKeywords
};