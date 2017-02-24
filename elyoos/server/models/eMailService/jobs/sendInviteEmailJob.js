"use strict";

let db = requireDb();
let tmp = require('tmp');
let email = require('elyoos-server-lib').eMail;
let cdn = require('elyoos-server-lib').cdn;
let fs = require('fs');

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

let getUserImage = function (userId) {
    let imageData, userImage = tmp.fileSync({postfix: '.jpg'});
    imageData = cdn.getObject(`profileImage/${userId}/profile.jpg`);
    fs.writeFileSync(userImage.name, imageData.Body);
    return userImage;
};

let setInvitationSentFlag = function (userId, sentEmails, userImage, numberOfRequestedEmails, numberOfTotalRequests, done) {
    if (numberOfRequestedEmails === numberOfTotalRequests) {
        userImage.removeCallback();
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
        let sentEmails = [], requestEmails = [], userImage = getUserImage(data.userId);
        invitedUsers.forEach(function (invitedUser) {
            email.sendEMail("invitePerson", {name: data.name, userId: data.userId, userImage: userImage}, invitedUser).then(function () {
                sentEmails.push(invitedUser);
                requestEmails.push(invitedUser);
                setInvitationSentFlag(data.userId, sentEmails, userImage, requestEmails.length, invitedUsers.length, done);
            }).catch(function () {
                requestEmails.push(invitedUser);
                setInvitationSentFlag(data.userId, sentEmails, userImage, requestEmails.length, invitedUsers.length, done);
            });
        });
        return sentEmails;
    });
};

module.exports = {
    processDefinition: processDefinition
};
