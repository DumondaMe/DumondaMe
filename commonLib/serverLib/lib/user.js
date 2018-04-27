'use strict';

let db = require('./neo4j');
let logger = require('./logging').getLogger(__filename);

let searchUserWithEmail = function (email) {
    return db.cypher().match('(u:User {emailNormalized: {email}})')
        .return(`u.password AS password, u.emailNormalized AS email, u.userId AS id, u.elyoosAdmin AS elyoosAdmin,
                 u.language AS lang`)
        .end({email: email})
        .send()
        .then(function (resp) {
            if (resp.length === 1) {
                return resp[0];
            }
            if (resp.length > 1) {
                logger.error('More then one user with email address ' + email);
            }
        });
};

let UserLibrary = function () {
    return {
        serialize: function (user, done) {
            done(null, {id: user.id, elyoosAdmin: user.elyoosAdmin, lang: user.language, email: user.email});
        },
        deserialize: function (sessionUser, done) {
            done(null, sessionUser);
        },
        searchUserWithEmail: searchUserWithEmail
    };
};

module.exports = UserLibrary;
