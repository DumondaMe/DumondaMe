/*
"use strict";

let db = requireDb();
let time = require('elyoos-server-lib').time;
let eMailQueue = require('elyoos-server-lib').eMailQueue;
let randomstring = require("randomstring");
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let timeValid = 60 * 20;  //20 Minutes

let setPasswordIsRequested = async function (userId) {
    let linkId = randomstring.generate(64);
    await db.cypher().match("(user:User {userId: {userId}})").set("user", {
        resetPasswordRequestTimeout: time.getNowUtcTimestamp() + timeValid,
        resetPasswordLinkId: linkId
    }).end({userId: userId}).send();
    return linkId;
};

let sendReset = async function (email) {
    let originalEmailAddress;
    email = email.toLowerCase();
    let resp = await db.cypher().match("(user:User {emailNormalized: {email}})")
        .return("user").end({email: email}).send();
    if (resp.length === 1) {
        originalEmailAddress = resp[0].user.email;
        if ((resp[0].user.hasOwnProperty('resetPasswordRequestTimeout') &&
            resp[0].user.resetPasswordRequestTimeout < time.getNowUtcTimestamp()) ||
            !resp[0].user.hasOwnProperty('resetPasswordRequestTimeout')) {
            let linkId = await setPasswordIsRequested(resp[0].user.userId);
            eMailQueue.createImmediatelyJob('resetPassword', {email: originalEmailAddress, linkId: linkId});
        } else {
            logger.info(`Reset password email is not sent to ${originalEmailAddress}`);
        }
    } else {
        logger.info(`User not found for ${email}`);
    }
};

module.exports = {
    sendReset: sendReset
};
*/
