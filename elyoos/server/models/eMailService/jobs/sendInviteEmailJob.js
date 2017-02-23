"use strict";

let db = requireDb();
let email = require('elyoos-server-lib').eMail;

let getInvitationToSend = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})-[:HAS_INVITED]->(invitedUser:InvitedUser)")
        .where("NOT exists(invitedUser.invitationSent) OR invitedUser.invitationSent = false")
        .return("invitedUser.email AS email, invitedUser.invitationSent AS invitationSent")
        .end({userId: userId}).send().then(function (resp) {
            let invitedUserCollection = [];
            resp.forEach(function (invitedUser) {
                if (!invitedUser.invitationSent) {
                    invitedUserCollection.push(invitedUser.email);
                }
            });
            return invitedUserCollection;
        });
};

let setInvitationSentFlag = function (userId, sentEmails) {
    return db.cypher().match("(user:User {userId: {userId}})-[:HAS_INVITED]->(invitedUser:InvitedUser)")
        .where("invitedUser.email IN {sentEmails}")
        .set("invitedUser", {invitationSent: true})
        .end({userId: userId, sentEmails: sentEmails}).send();
};

let processDefinition = function (data, done) {

    return getInvitationToSend(data.userId).then(function (invitedUsers) {
        let sentEmails = [];
        invitedUsers.forEach(function (invitedUser) {
            if (email.sendEMail("invitePerson", {name: data.name, userId: data.userId}, invitedUser)) {
                sentEmails.push(invitedUser);
            }
        });
        return sentEmails;
    }).then(function (sentEmails) {
        return setInvitationSentFlag(data.userId, sentEmails);
    }).then(function () {
        done();
    });
};

module.exports = {
    processDefinition: processDefinition
};
