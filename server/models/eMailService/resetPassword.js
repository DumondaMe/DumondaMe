"use strict";

var db = require('./../../neo4j');
var time = require('./../../lib/time');
var eMailQueue = require('./../../lib/eMail/eMailQueue');
var randomstring = require("randomstring");

var timeValid = 60 * 20;  //20 Minutes

var setPasswordIsRequested = function (userId) {
    var linkId = randomstring.generate(64);
    return db.cypher().match("(user:User {userId: {userId}})").set("user", {
        resetPasswordRequestTimeout: time.getNowUtcTimestamp() + timeValid,
        resetPasswordLinkId: linkId
    }).end({userId: userId}).send()
        .then(function () {
            return linkId;
        });
};

var sendReset = function (email) {
    return db.cypher().match("(user:User {email: {email}})")
        .return("user").end({email: email}).send()
        .then(function (resp) {
            if (resp.length === 1) {
                if (resp[0].user.hasOwnProperty('resetPasswordRequestTimeout') && resp[0].user.resetPasswordRequestTimeout < time.getNowUtcTimestamp()) {
                    return setPasswordIsRequested(resp[0].user.userId);
                } else if (!resp[0].user.hasOwnProperty('resetPasswordRequestTimeout')) {
                    return setPasswordIsRequested(resp[0].user.userId);
                }
            }
        }).then(function (linkId) {
            if (linkId) {
                eMailQueue.createImmediatelyJob('sendPasswordReset', {email: email, linkId: linkId});
            }
        });
};

module.exports = {
    sendReset: sendReset
};
