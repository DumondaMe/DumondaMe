'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;

const getExistingUserInfo = async function (users, userId) {
    let emails = users.map(user => user.email.trim().toLowerCase());
    let resp = await db.cypher().match(`(u:User)`)
        .where(`u.emailNormalized IN {emails}`)
        .return(`u.emailNormalized AS email, u.userId AS userId, u.name AS name,
                 EXISTS((:User {userId: {userId}})-[:IS_CONTACT]->(u)) AS isTrustUser`)
        .end({emails, userId}).send();

    for (let existingUser of resp) {
        let user = users.find(user => user.email.trim().toLowerCase() === existingUser.email);
        user.isPlatformUser = true;
        user.isLoggedInUser = existingUser.userId === userId;
        user.isAnonymous = false;
        user.userId = existingUser.userId;
        user.name = existingUser.name;
        user.userImage = await cdn.getSignedUrl(`profileImage/${existingUser.userId}/profilePreview.jpg`);
        user.isTrustUser = existingUser.isTrustUser;
    }
};

const getInvitedUserInfo = async function (users, userId) {
    let emails = users.map(user => user.email.trim().toLowerCase());
    let resp = await db.cypher().match(`(u:InvitedUser)`)
        .where(`u.emailNormalized IN {emails}`)
        .return(`u.emailNormalized AS email, 
                 EXISTS((:User {userId: {userId}})-[:HAS_INVITED]->(u)) AS alreadySentInvitation,
                 ANY (label IN labels(u) WHERE label = 'EMailNotificationEnabled') AS allowedToSentInvitation`)
        .end({emails, userId}).send();

    for (let invitedUser of resp) {
        let user = users.find(user => user.email.trim().toLowerCase() === invitedUser.email);
        user.alreadySentInvitation = invitedUser.alreadySentInvitation;
        user.notAllowedToSentInvitation = !invitedUser.allowedToSentInvitation;
    }
};

const getUserInfo = async function (users, userId) {
    if (users && users.length > 0) {
        await getInvitedUserInfo(users, userId);
        await getExistingUserInfo(users, userId);
    }
    return users;
};

module.exports = {
    getUserInfo
};
