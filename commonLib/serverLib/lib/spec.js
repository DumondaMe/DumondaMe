'use strict';

let passport = require('passport');
let cookie = require('cookie-signature');
let auth = require('./auth');
let userLib = require('./user')();
let db = require('./databaseConfig');
let cookieKey;
let cookieSecret;

module.exports = function (app, nuxt) {

    app.on('middleware:before:appsec', function () {
        app.get('/healthCheck', function (req, res) {
            res.type('text/plain');
            res.send("OK");
        });
    });

    app.on('middleware:before:json', function () {
        if ('testing' !== process.env.NODE_ENV &&
            (process.env.REDIRECT_WWW === 'true' || process.env.REDIRECT_HTTPS === 'true')) {
            app.use(function (req, res, next) {
                if (process.env.REDIRECT_WWW === 'true' &&
                    req.headers.host.match(/^www/) === null) {
                    return res.redirect('https://www.' + req.headers.host + req.url, 301);
                }
                if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toLowerCase() === 'http' &&
                    process.env.REDIRECT_HTTPS === 'true') {
                    return res.redirect('https://' + req.headers.host + req.url);
                }
                next();
            });
        }
    });

    app.on('middleware:after:session', function () {
        app.use(passport.initialize());
        app.use(passport.session());
        //Tell passport to use our newly created local strategy for authentication
        passport.use(auth.localStrategy());
        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(userLib.serialize);
        passport.deserializeUser(userLib.deserialize);

        if ('testing' !== process.env.NODE_ENV) {
            app.use(function (req, res, next) {
                //Needed because rolling is some how not working
                req.session.touch();
                next();
            });
        }

        if (nuxt && nuxt.render) {
            app.use(function (req, res, next) {
                if (req.originalUrl.match(/api/) === null) {
                    req.headers.cookie = cookieKey + '=s:' + cookie.sign(req.sessionID, cookieSecret);
                }
                req.session.save(function () {
                    if (req.originalUrl.match(/api/) === null) {
                        nuxt.render(req, res);
                    } else {
                        next();
                    }
                });
            });
        }
    });

    if (process.env.ROBOT_TEXT_ENABLE_CRAWLER === 'true') {
        app.get('/robots.txt', function (req, res) {
            res.type('text/plain');
            res.send("User-agent: *\nDisallow: ");
        });
    } else {
        app.get('/robots.txt', function (req, res) {
            res.type('text/plain');
            res.send("User-agent: *\nDisallow: /");
        });
    }

    return {
        onconfig: function (config, next) {

            let dbConfig = config.get('databaseConfig');
            db.config(dbConfig);
            let cookieConfig = config.get('middleware').session.module.arguments.find(arg => arg.cookie);
            cookieKey = cookieConfig.key;
            cookieSecret = cookieConfig.secret;

            next(null, config);
        }
    };

};
