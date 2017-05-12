'use strict';

let db = requireDb();

let unsubscribe = function (email) {
    email = email.toLowerCase();
    return db.cypher().merge("(user:UnsubscribeInvitation {email: {email}})")
        .end({email: email}).send();
};

module.exports = {
    unsubscribe: unsubscribe
};
