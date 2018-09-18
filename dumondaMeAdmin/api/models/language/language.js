'use strict';

const db = requireDb();

const setLanguage = async function (user, session, language) {

    if (session.userData && session.userData.lang) {
        session.userData.lang = language;
    } else {
        session.userData = {lang: language};
    }
    if (user && user.id) {
        await db.cypher().match("(user:User {userId: {userId}})")
            .set('user', {language: language})
            .end({userId: user.id}).send();
    }
};

module.exports = {
    setLanguage
};
