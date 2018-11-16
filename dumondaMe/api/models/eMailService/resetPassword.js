"use strict";

const db = requireDb();
const time = require('dumonda-me-server-lib').time;
const eMail = require('dumonda-me-server-lib').eMail;
const uuidv4 = require('uuid/v4');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const timeValid = 60 * 20;  //20 Minutes

const setPasswordIsRequested = async function (userId) {
    let linkId = uuidv4();
    await db.cypher().match("(user:User {userId: {userId}})").set("user", {
        resetPasswordRequestTimeout: time.getNowUtcTimestamp() + timeValid,
        resetPasswordLinkId: linkId
    }).end({userId: userId}).send();
    return linkId;
};

const sendReset = async function (email, language, res) {
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

            await eMail.sendEMail('resetPassword',
                {link: `${process.env.DUMONDA_ME_DOMAIN}login/passwordReset?linkId=${linkId}`},
                language, originalEmailAddress);
            res.status(200).end();
        } else {
            logger.info(`Reset password email is not sent to ${originalEmailAddress}`);
            res.status(429).end();
        }
    } else {
        logger.info(`User not found for ${email}`);
        res.status(404).end();
    }
};

module.exports = {
    sendReset
};
