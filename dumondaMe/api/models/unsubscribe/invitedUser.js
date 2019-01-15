'use strict';

const db = requireDb();

const unsubscribe = async function (email) {
    email = email.toLowerCase();
    await db.cypher().match("(invitedUser:InvitedUser {emailNormalized: {email}})")
        .remove(`invitedUser:EMailNotificationEnabled`)
        .end({email}).send();
};

module.exports = {
    unsubscribe
};
