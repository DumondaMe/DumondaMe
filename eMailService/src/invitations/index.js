"use strict";

const db = requireDb();
const tmp = require('tmp');
const cdn = require('dumonda-me-server-lib').cdn;
const fs = require('fs');
const eMail = require('dumonda-me-server-lib').eMail;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const LIMIT = 10;

const getUserImage = async function (userId) {
    let imageData, userImage = tmp.fileSync({postfix: '.jpg'});
    imageData = await cdn.getObject(`profileImage/${userId}/profile.jpg`, process.env.BUCKET_PRIVATE);
    fs.writeFileSync(userImage.name, imageData.Body);
    return userImage;
};

const removeSendingEmailPending = async function (emails, userId) {
    if (Array.isArray(emails) && emails.length > 0) {
        await db.cypher()
            .match(`(invitedUser:InvitedUser)<-[sendingPending:SENDING_EMAIL_PENDING]-(:User {userId: {userId}})`)
            .where(`invitedUser.emailNormalized IN {emails}`)
            .delete(`sendingPending`)
            .end({emails, userId}).send();
    }
};

const sendEMails = async function (users) {
    for (let user of users) {
        let sentInvitations = [], userImage;
        try {
            userImage = await getUserImage(user.userId);
            for (let userToInvite of user.emails) {
                let unsubscribeLink = `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/invitedUser/${userToInvite}`;
                await eMail.sendEMail('invitePerson',
                    {unsubscribeLink, userImage, name: user.name}, 'de', userToInvite);
                sentInvitations.push(userToInvite);
            }
        } catch (error) {
            logger.error(`Failed to send invitation from user ${user.userId} ${error}`);
        } finally {
            if (userImage && typeof userImage.removeCallback === 'function') {
                userImage.removeCallback();
            }
            await removeSendingEmailPending(sentInvitations, user.userId);
        }
    }

};

let invitationJobIsRunning = false;

const sendInvitations = async function () {
    let skip = 0, users = [];
    if (!invitationJobIsRunning) {
        try {
            invitationJobIsRunning = true;
            do {
                users = await db.cypher()
                    .match(`(invitedUser:InvitedUser)<-[:SENDING_EMAIL_PENDING]-(user:User)`)
                    .return(`collect(DISTINCT invitedUser.emailNormalized) AS emails, 
                     user.userId AS userId, user.name AS name`)
                    .orderBy(`user.userId`)
                    .skip(skip)
                    .limit(LIMIT).end().send();
                await sendEMails(users);

            } while (users.length === LIMIT);
        } finally {
            invitationJobIsRunning = false;
        }
    }
};


module.exports = {
    sendInvitations
};
