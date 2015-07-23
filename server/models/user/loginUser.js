'use strict';

var db = require('./../../neo4j');
var time = require('./../../lib/time');

var setTimestamp = function (userId) {
    var commands = [];

    commands.push(db.cypher().match("(user:User {userId: {userId}}) SET user.previousLastLogin = user.lastLogin")
        .end({userId: userId}).getCommand());

    return db.cypher().match("(user:User {userId: {userId}})").set('user', {lastLogin: time.getNowUtcTimestamp()})
        .end({userId: userId})
        .send(commands);
};

module.exports = {
    setTimestamp: setTimestamp
};
