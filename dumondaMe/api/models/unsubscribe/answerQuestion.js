'use strict';

const db = requireDb();

const unsubscribe = async function (email) {
    email = email.toLowerCase();
    await db.cypher().match("(user:User {emailNormalized: {email}})")
        .set(`user`, {disableInviteAnswerQuestionNotification: true})
        .end({email}).send();
};

module.exports = {
    unsubscribe
};
