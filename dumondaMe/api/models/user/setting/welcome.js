'use strict';

let db = requireDb();

let welcomeFinish = async function (userId) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set('user', {infoState: 1})
        .end({userId}).send();
};

module.exports = {
    welcomeFinish
};
