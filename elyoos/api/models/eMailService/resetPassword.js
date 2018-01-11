"use strict";

let db = requireDb();
let time = require('elyoos-server-lib').time;
let eMailQueue = require('elyoos-server-lib').eMailQueue;
let randomstring = require("randomstring");
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let timeValid = 60 * 20;  //20 Minutes

let setPasswordIsRequested = function (userId) {
    let linkId = randomstring.generate(64);
    return db.cypher().match("(user:User {userId: {userId}})").set("user", {
        resetPasswordRequestTimeout: time.getNowUtcTimestamp() + timeValid,
        resetPasswordLinkId: linkId
    }).end({userId: userId}).send()
        .then(function () {
            return linkId;
        });
};

let sendReset = function (email) {
    let originalEmailAddress;
    email = email.toLowerCase();
    return db.cypher().match("(user:User {emailNormalized: {email}})")
        .return("user").end({email: email}).send()
        .then(function (resp) {
            if (resp.length === 1) {
                originalEmailAddress = resp[0].user.email;
                if (resp[0].user.hasOwnProperty('resetPasswordRequestTimeout') &&
                    resp[0].user.resetPasswordRequestTimeout < time.getNowUtcTimestamp()) {
                    return setPasswordIsRequested(resp[0].user.userId);
                } else if (!resp[0].user.hasOwnProperty('resetPasswordRequestTimeout')) {
                    return setPasswordIsRequested(resp[0].user.userId);
                }
            }
        }).then(function (linkId) {
            if (linkId) {
                eMailQueue.createImmediatelyJob('resetPassword', {email: originalEmailAddress, linkId: linkId});
            } else {
                logger.info(`Reset password email is not sent to ${originalEmailAddress}`);
            }
        });
};

module.exports = {
    sendReset: sendReset
};
