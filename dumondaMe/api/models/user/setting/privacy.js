'use strict';

let db = requireDb();

let changePrivacySettings = async function (userId, privacyMode, showProfileActivity) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set('user', {privacyMode, showProfileActivity})
        .end({userId: userId}).send();
};

module.exports = {
    changePrivacySettings
};
