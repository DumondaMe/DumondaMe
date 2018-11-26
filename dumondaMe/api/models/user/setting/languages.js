'use strict';

let db = requireDb();

let changeLanguagesSettings = async function (userId, languages) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set('user', {languages})
        .end({userId}).send();
};

module.exports = {
    changeLanguagesSettings
};
