'use strict';

var express = require('express'),
    passport = require('passport'),
    methodOverride = require('method-override'),
    csrf = require('csurf'),
    auth = require('./auth'),
    userLib = require('./user')(),
    db = require('./database'),
    cdn = require('./cdn');

module.exports = function (app) {

    var env = process.env.NODE_ENV || 'development';
    app.on('middleware:before:json', function () {
        if ('testing' !== env) {
            app.use(function redirectHTTP(req, res, next) {

                if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toLowerCase() === 'http') {
                    return res.redirect('https://' + req.headers.host + req.url);
                }
                next();
            });
        }
    });

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

    app.on('middleware:after:appsec', function () {
        if ('testing' !== env) {
            app.use(csrf());
            app.use(function (req, res, next) {
                res.cookie('XSRF-TOKEN', req.csrfToken());
                next();
            });
        }
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
