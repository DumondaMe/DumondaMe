'use strict';

var db = require('../db');

var commands = [];

var init = function () {
    commands = [];
};

var sendToDb = function () {
    return db.cypher().match("(s:Some)").return('s').end().send(commands);
};

var getCommands = function () {
    return commands;
};

module.exports = {
    init: init,
    getCommands: getCommands,
    sendToDb: sendToDb
};