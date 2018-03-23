'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createTopic = function (name) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(:Topic {name: {name}})`)
        .end({name}).getCommand());
};

module.exports = {
    createTopic
};