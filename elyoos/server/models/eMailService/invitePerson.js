"use strict";

let db = requireDb();
let _ = require('lodash');
let eMailQueue = require('elyoos-server-lib').eMailQueue;

let getEmailsInvitedUser = function (userId, emails) {
    return db.cypher().match("(sender:User {userId: {userId}})")
        .optionalMatch("(user:User)")
        .where("user.email IN {emails}")
        .return("collect(user.email) AS emails, sender")
        .union()
        .match("(sender:User {userId: {userId}})")
        .optionalMatch("(user:UnsubscribeInvitation)")
        .where("user.email IN {emails}")
        .return("collect(user.email) AS emails, sender")
        .end({emails: emails, userId: userId}).send()
        .then(function (resp) {
            if (resp.length > 0) {
                let sender = resp[0].sender, emailsToSubtract = resp[0].emails;
                if (resp.length > 1) {
                    emailsToSubtract = emailsToSubtract.concat(resp[1].emails);
                }
                return {name: sender.name, emails: _.difference(emails, emailsToSubtract)};
            }
            return {emails: []};
        });
};

let getUserIdsInvitedUserWithAccount = function (userId, emails) {
    return db.cypher().match("(sender:User {userId: {userId}}), (user:User)")
        .where("user.email IN {emails} AND NOT (sender)-[:IS_CONTACT]->(user)")
        .return("collect(user.userId) AS userIds").end({emails: emails, userId: userId}).send()
        .then(function (resp) {
            if (resp.length === 1) {
                return {userIds: resp[0].userIds};
            }
            return {userIds: []};
        });
};

let addInviteUser = function (userId, emails, message) {
    return db.cypher().match("(sender:User {userId: {userId}})")
        .foreach(`(invitedUser IN {emails} | 
        CREATE UNIQUE (sender)-[:HAS_INVITED]->(:InvitedUser {email: invitedUser, message: {message}}))`)
        .end({emails: emails, userId: userId, message: message}).send();
};

let addInviteToExistingUser = function (userId, userIds) {
    return db.cypher().match("(sender:User {userId: {userId}}), (existingUser:User)")
        .where("existingUser.userId IN {userIds}")
        .createUnique(`(sender)-[:HAS_INVITED]->(existingUser)`)
        .end({userIds: userIds, userId: userId}).send();
};

let sendInvitation = function (userId, emails, message) {
    message = message || null;
    return getEmailsInvitedUser(userId, emails).then(function (data) {
        if (data.emails.length > 0) {
            return addInviteUser(userId, data.emails, message).then(function () {
                eMailQueue.createImmediatelyJob('sendInviteEmail', {userId: userId, name: data.name});
            });
        }
    }).then(function () {
        return getUserIdsInvitedUserWithAccount(userId, emails);
    }).then(function (data) {
        return addInviteToExistingUser(userId, data.userIds);
    });
};

module.exports = {
    sendInvitation: sendInvitation
};
