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

let setInvitationSentFlag = function (userId, sentEmails, numberOfRequestedEmails, numberOfTotalRequests, done) {
    if (numberOfRequestedEmails === numberOfTotalRequests) {
        db.cypher().match("(user:User {userId: {userId}})-[:HAS_INVITED]->(invitedUser:InvitedUser)")
            .where("invitedUser.email IN {sentEmails}")
            .set("invitedUser", {invitationSent: true})
            .end({userId: userId, sentEmails: sentEmails}).send().then(function () {
            done();
        });
    }
};

let processDefinition = function (data, done) {

    return getInvitationToSend(data.userId).then(function (invitedUsers) {
        let sentEmails = [], requestEmails = [];
        invitedUsers.forEach(function (invitedUser) {
            email.sendEMail("invitePerson", {name: data.name, userId: data.userId}, invitedUser).then(function () {
                sentEmails.push(invitedUser);
                requestEmails.push(invitedUser);
                setInvitationSentFlag(data.userId, sentEmails, requestEmails.length, invitedUsers.length, done);
            }).catch(function () {
                requestEmails.push(invitedUser);
                setInvitationSentFlag(data.userId, sentEmails, requestEmails.length, invitedUsers.length, done);
            });
        });
        return sentEmails;
    });
};

module.exports = {
    processDefinition: processDefinition
};
