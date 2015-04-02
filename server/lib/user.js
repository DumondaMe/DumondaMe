'use strict';

var userModel = require('./../models/user/user');
var LRU = require('lru-cache');
var options = {
    max: 1000,
    //30 minutes in cache
    maxAge: 1000 * 60 * 30
};
var cache = LRU(options);

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
                userModel.searchUserWithEmail(email).then(function (user) {
                    cache.set(email, user);
                    done(null, user);
                }).catch(function (err) {
                    done(err, null);
                });
            }
        },
        removeFromCache: function (email) {
            cache.del(email);
        }
    };
};

module.exports = UserLibrary;
