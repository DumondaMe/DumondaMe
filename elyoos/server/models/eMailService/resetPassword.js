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
    email = email.toLowerCase();
    return db.cypher().match("(user:User {email: {email}})")
        .return("user").end({email: email}).send()
        .then(function (resp) {
            if (resp.length === 1) {
                if (resp[0].user.hasOwnProperty('resetPasswordRequestTimeout') &&
                    resp[0].user.resetPasswordRequestTimeout < time.getNowUtcTimestamp()) {
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
