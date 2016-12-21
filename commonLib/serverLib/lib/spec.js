'use strict';

var passport = require('passport');
var methodOverride = require('method-override');
var csrf = require('csurf');
var auth = require('./auth');
var userLib = require('./user')();
var db = require('./databaseConfig');
var cdn = require('./cdn');
var email = require('./eMail/eMailQueue');
var version = require('./version');

module.exports = function (app) {

    var env = process.env.NODE_ENV || 'development';
    app.on('middleware:before:json', function () {
        if ('testing' !== env) {
            app.use(function (req, res, next) {

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

    app.on('middleware:after:session', function () {
        if ('testing' !== env) {
            app.use(function (req, res, next) {
                //Needed because rolling is some how not working
                req.session.touch();
                next();
            });
        }
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

    app.use(function (req, res, next) {
        var originalStatus = res.status;
        res.status = function (data) {
            if (req.headers.elyoosversion && req.headers.elyoosversion !== version.getVersion()) {
                data = 418;
            }
            return originalStatus.apply(this, [data]);
        };
        next();
    });

    return {
        onconfig: function (config, next) {

            var dbConfig = config.get('databaseConfig'),
                cdnConfig = config.get('cdnStore'),
                emailConfig = config.get('emailConfig');

            cdn.config(cdnConfig);
            db.config(dbConfig);
            email.config(emailConfig);
            next(null, config);
        }
    };

};
