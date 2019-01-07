'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;

const getExistingUserInfo = async function (users, userId) {
    let emails = users.map(user => user.email.trim().toLowerCase());
    let resp = await db.cypher().match(`(u:User)`)
        .where(`u.emailNormalized IN {emails}`)
        .return(`u.emailNormalized AS email, u.userId AS userId, u.name AS name,
                 EXISTS ((:User {userId: {userId}})-[:IS_CONTACT]->(u)) AS isTrustUser`)
        .end({emails, userId}).send();

    for (let existingUser of resp) {
        let user = users.find(user => user.email.trim().toLowerCase() === existingUser.email);
        user.isPlatformUser = true;
        user.isAnonymous = false;
        user.userId = existingUser.userId;
        user.name = existingUser.name;
        user.userImage = await cdn.getSignedUrl(`profileImage/${existingUser.userId}/thumbnail.jpg`);
        user.isTrustUser = existingUser.isTrustUser;
    }
    return users;
};

module.exports = {
    getExistingUserInfo
};
