'use strict';

var db = require('./neo4j');
var logger = require('./logging').getLogger(__filename);
var LRU = require('lru-cache');
var options = {
    max: 1000,
    //30 minutes in cache
    maxAge: 1000 * 60 * 30
};
var cache = LRU(options);

var searchUserWithEmail = function (email) {
    return db.cypher().match('(u:User {email: {email}})')
        .return('u.password AS password, u.email AS email, u.userId AS id, u.elyoosAdmin AS elyoosAdmin')
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

var UserLibrary = function () {
    return {
        serialize: function (user, done) {
            done(null, user.email);
        },
        deserialize: function (email, done) {
            var cachedUser = cache.get(email);
            if (cachedUser) {
                done(null, cachedUser);
            } else {
                searchUserWithEmail(email).then(function (user) {
                    cache.set(email, user);
                    done(null, user);
                }).catch(function (err) {
                    done(err, null);
                });
            }
        },
        removeFromCache: function (email) {
            cache.del(email);
        },
        searchUserWithEmail: searchUserWithEmail
    };
};

module.exports = UserLibrary;
