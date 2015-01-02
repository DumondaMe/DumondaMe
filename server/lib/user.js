'use strict';

var userModel = require('../models/user/user');
var LRU = require('lru-cache');
var options = {
    max: 1000,
    maxAge: 1000 * 60 * 30 //30 minutes
};
var cache = LRU(options);

var UserLibrary = function () {
    return {
        serialize: function (user, done) {
            done(null, user.email);
        },
        deserialize: function (email, done) {
            var user = cache.get(email);
            if (user) {
                done(null, user);
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
