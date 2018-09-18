'use strict';

let db = requireDb();

let changePrivacySettings = async function (userId, privacyMode) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set('user', {privacyMode: privacyMode})
        .end({userId: userId}).send();
};

module.exports = {
    changePrivacySettings
};
