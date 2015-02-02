'use strict';

var express = require('express'),
    passport = require('passport'),
    methodOverride = require('method-override'),
    auth = require('./auth'),
    userLib = require('./user')(),
    db = require('./database'),
    cdn = require('./../../common/src/lib/cdn');

module.exports = function (app) {
    app.on('middleware:before:router', function () {
        app.use(passport.initialize());
        app.use(passport.session());
        //Tell passport to use our newly created local strategy for authentication
        passport.use(auth.localStrategy());
        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(userLib.serialize);
        passport.deserializeUser(userLib.deserialize);
    });

    app.on('middleware:before:urlEncoded', function () {
        app.use(methodOverride('X-HTTP-Method-Override'));
    });

    return {
        onconfig: function (config, next) {

            var dbConfig = config.get('databaseConfig'),
                cdnConfig = config.get('cdnStore');

            cdn.config(cdnConfig);
            db.config(dbConfig);
            next(null, config);
        }
    };

};
