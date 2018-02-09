"use strict";

let db = requireDb();
let tmp = require('tmp');
let email = require('elyoos-server-lib').eMail;
let cdn = require('elyoos-server-lib').cdn;
let fs = require('fs');

let getInvitationToSend = function (userId) {
    return db.cypher().match("(user:User {userId: {userId}})-[:HAS_INVITED]->(invitedUser:InvitedUser)")
        .where(`NOT exists(invitedUser.invitationSent) OR invitedUser.invitationSent = false`)
        .return(`invitedUser.email AS email, invitedUser.message AS message`)
        .end({userId: userId}).send();
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
        if (invitedUsers.length > 0) {
            let sentEmails = [], requestEmails = [], userImage = getUserImage(data.userId);
            invitedUsers.forEach(function (invitedUser) {
                email.sendEMail("invitePerson", {
                    name: data.name, userId: data.userId, userMessage: invitedUser.message, userImage: userImage,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/${invitedUser.email}`
                }, invitedUser.email).then(function () {
                    sentEmails.push(invitedUser.email);
                    requestEmails.push(invitedUser.email);
                    setInvitationSentFlag(data.userId, sentEmails, userImage, requestEmails.length, invitedUsers.length, done);
                }).catch(function () {
                    requestEmails.push(invitedUser.email);
                    setInvitationSentFlag(data.userId, sentEmails, userImage, requestEmails.length, invitedUsers.length, done);
                });
            });
            return sentEmails;
        } else {
            done();
        }
    });
};

module.exports = {
    processDefinition: processDefinition
};
