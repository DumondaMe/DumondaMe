'use strict';

let db = requireDb();

let changeLanguagesSettings = async function (userId, languages, req) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set('user', {languages})
        .end({userId}).send();
    req.user.languages = languages;
    req.session.save();
};

module.exports = {
    changeLanguagesSettings
};
