'use strict';

let db = require('../db');

let commands = [];

let init = function () {
    commands = [];
};

let sendToDb = function () {
    return db.cypher().match("(s:Some)").return('s').end().send(commands);
};

let getCommands = function () {
    return commands;
};

module.exports = {
    init: init,
    getCommands: getCommands,
    sendToDb: sendToDb
};