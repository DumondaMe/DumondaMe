'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');


const disableEMailNotification = function (userId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .remove(`u:EMailNotificationEnabled`).end({userId}).getCommand());
};

const disableEMailNotificationForInvitedUser = function (email) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:InvitedUser {emailNormalized: {email}})")
        .remove(`u:EMailNotificationEnabled`).end({email}).getCommand());
};

const disableInviteAnswerQuestionNotification = function (userId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set('u', {disableInviteAnswerQuestionNotification: true}).end({userId}).getCommand());
};

const disableNewNotificationEmail = function (userId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(u:User {userId: {userId}})")
        .set('u', {disableNewNotificationEmail: true}).end({userId}).getCommand());
};

module.exports = {
    disableEMailNotification,
    disableEMailNotificationForInvitedUser,
    disableInviteAnswerQuestionNotification,
    disableNewNotificationEmail
};