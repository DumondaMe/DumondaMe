"use strict";

let db = requireDb();
let _ = require('lodash');
let eMailQueue = require('elyoos-server-lib').eMailQueue;

let getEmailsWithoutExistingUser = function (userId, emails) {
    return db.cypher().match("(sender:User {userId: {userId}})")
        .optionalMatch("(user:User)")
        .where("user.email IN {emails}")
        .return("collect(user.email) AS emails, sender").end({emails: emails, userId: userId}).send()
        .then(function (resp) {
            if (resp.length === 1) {
                let sender = resp[0].sender;
                return {name: sender.name, emails: _.difference(emails, resp[0].emails)};
            }
            return null;
        });
};

let addInviteUser = function (userId, emails) {
    return db.cypher().match("(sender:User {userId: {userId}})")
        .foreach("(invitedUser IN {emails} | CREATE UNIQUE (sender)-[:HAS_INVITED]->(:InvitedUser {email: invitedUser}))")
        .end({emails: emails, userId: userId}).send();
};

let sendInvitation = function (userId, emails) {
    return getEmailsWithoutExistingUser(userId, emails).then(function (data) {
        if (_.isObject(data) && data.emails.length > 0) {
            return addInviteUser(userId, data.emails).then(function () {
                eMailQueue.createImmediatelyJob('sendInviteEmail', {userId: userId, name: data.name});
            });
        }
    });
};

module.exports = {
    sendInvitation: sendInvitation
};
