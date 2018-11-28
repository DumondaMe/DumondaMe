'use strict';

let db = requireDb();

let welcomeFinish = async function (userId, req) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set('user', {infoState: 1})
        .end({userId}).send();
    req.user.infoState = 1;
    req.session.save();
};

module.exports = {
    welcomeFinish
};
