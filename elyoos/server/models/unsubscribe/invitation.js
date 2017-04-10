'use strict';

let db = requireDb();

let unsubscribe = function (email) {
    return db.cypher().match("(user:InvitedUser {email: {email}})")
        .set("user", {unsubscribeInvitation: true})
        .end({email: email}).send();
};

module.exports = {
    unsubscribe: unsubscribe
};
