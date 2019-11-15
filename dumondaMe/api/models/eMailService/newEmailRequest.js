"use strict";

const db = requireDb();
const eMail = require('dumonda-me-server-lib').eMail;
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const exceptions = require('dumonda-me-server-lib').exceptions;

const ERROR_CODE_EMAIL_ALREADY_EXISTING = 1;

const userWithEmailExistsCommand = function (newEMailAddress) {
    return db.cypher().match(`(user:User {emailNormalized: {newEMailAddress}})`)
        .return(`user`)
        .end({newEMailAddress: newEMailAddress.trim().toLowerCase()}).getCommand();
};

const checkAllowedToChangeEmail = async function (userId, newEMailAddress) {
    let user = await db.cypher().match(`(user:User {userId: {userId}})`)
        .return(`user.email AS email`)
        .end({userId}).send([userWithEmailExistsCommand(newEMailAddress)]);
    if (user[1].length > 0 && user[1][0].email && user[1][0].email.toLowerCase() === newEMailAddress.toLowerCase()) {
        throw new exceptions
            .InvalidOperation(`No allowed to used existing email address ${newEMailAddress} for ${userId}`);
    }
    if (user[0].length > 0) {
        throw new exceptions
            .InvalidOperation(`User with email address ${newEMailAddress} exists already. Failed for user ${userId}`,
                ERROR_CODE_EMAIL_ALREADY_EXISTING);
    }
};

const sendNewEmailRequest = async function (userId, newEMailAddress) {
    let verify = uuid.generateUUID();
    await checkAllowedToChangeEmail(userId, newEMailAddress);
    let users = await db.cypher().match(`(user:User {userId: {userId}})`)
        .merge(`(user)-[:NEW_EMAIL_REQUEST]->(request:NewEMail)`)
        .set(`request`, {email: newEMailAddress, verify, created: time.getNowUtcTimestamp()})
        .return(`user.name AS name, user.language AS language, user.email AS oldEMailAddress`)
        .end({userId}).send();

    if (users.length === 1) {
        await eMail.sendEMail('changeEmailRequestNewAddress',
            {name: users[0].name, link: `${process.env.DUMONDA_ME_DOMAIN}user/email/verify?linkId=${verify}`},
            users[0].language, newEMailAddress);
        await eMail.sendEMail('changeEmailRequestOldAddress',
            {name: users[0].name, newEmail: newEMailAddress}, users[0].language, users[0].oldEMailAddress);
    } else {
        throw new exceptions.InvalidOperation(`No user ${userId}`);
    }
};

module.exports = {
    sendNewEmailRequest
};
