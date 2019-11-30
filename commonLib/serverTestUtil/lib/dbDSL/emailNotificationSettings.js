'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');


const disableEMailNotification = function (userId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .remove(`u:EMailNotificationEnabled`).end({userId}).getCommand());
};

const setEMailInterval = function (userId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set(`u`, {userId, emailNotificationInterval: data.interval}).end().getCommand());
};
const disableEMailNotificationForInvitedUser = function (email) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:InvitedUser {emailNormalized: {email}})")
        .remove(`u:EMailNotificationEnabled`).end({email}).getCommand());
};

module.exports = {
    disableEMailNotification,
    setEMailInterval,
    disableEMailNotificationForInvitedUser
};