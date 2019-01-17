'use strict';

const db = requireDb();

const unsubscribe = async function (email) {
    email = email.toLowerCase();
    await db.cypher().match("(user:User {emailNormalized: {email}})")
        .set(`user`, {disableNewNotificationEmail: true})
        .end({email}).send();
};

module.exports = {
    unsubscribe
};
