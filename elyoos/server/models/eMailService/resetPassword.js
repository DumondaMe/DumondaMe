"use strict";

var db = requireDb();
var time = requireLib('time');
var eMailQueue = requireLib('eMail/eMailQueue');
var randomstring = require("randomstring");
var logger = requireLogger.getLogger(__filename);

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
                eMailQueue.createImmediatelyJob('resetPassword', {email: email, linkId: linkId});
            } else {
                logger.info(`Reset password email is not sent to ${email}`);
            }
        });
};

module.exports = {
    sendReset: sendReset
};
