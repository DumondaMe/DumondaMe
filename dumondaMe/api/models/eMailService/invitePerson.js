"use strict";

const db = requireDb();
const tmp = require('tmp');
const email = require('elyoos-server-lib').eMail;
const cdn = require('elyoos-server-lib').cdn;
const fs = require('fs');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getUserImage = function (userId) {
    let imageData, userImage = tmp.fileSync({postfix: '.jpg'});
    imageData = cdn.getObject(`profileImage/${userId}/profile.jpg`);
    fs.writeFileSync(userImage.name, imageData.Body);
    return userImage;
};

const setInvitationSentFlag = async function (userId, sentEmails) {
    await db.cypher().match("(user:User {userId: {userId}})-[:HAS_INVITED]->(invitedUser:InvitedUser)")
        .where("invitedUser.email IN {sentEmails}")
        .set("invitedUser", {invitationSent: true})
        .end({userId: userId, sentEmails: sentEmails}).send();
};

const sendInvitation = async function (invitedUsers) {

    let sentEmails = [];
    if (invitedUsers.length > 0) {
        let userImage = getUserImage(data.userId);
        for (let invitedUser of invitedUsers) {
            try {
                await email.sendEMail("invitePerson", {
                    name: data.name, userMessage: invitedUser.message, userImage: userImage,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/${invitedUser.email}`
                }, 'de', invitedUser.email);
                sentEmails.push(invitedUser.email);
            } catch (error) {
                logger.warn(`Sending Invitation to ${invitedUser.email} failed`)
            } finally {
                if (userImage && userImage.removeCallback) {
                    userImage.removeCallback();
                }
            }
        }
        await setInvitationSentFlag(data.userId, sentEmails);
    }
    return sentEmails;
};

module.exports = {
    sendInvitation
};
