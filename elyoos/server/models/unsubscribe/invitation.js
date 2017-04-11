'use strict';

let db = requireDb();

let unsubscribe = function (email) {
    return db.cypher().merge("(user:UnsubscribeInvitation {email: {email}})")
        .end({email: email}).send();
};

module.exports = {
    unsubscribe: unsubscribe
};
