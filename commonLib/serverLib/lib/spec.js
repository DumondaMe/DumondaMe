'use strict';

let passport = require('passport');
let methodOverride = require('method-override');
let csrf = require('csurf');
let auth = require('./auth');
let userLib = require('./user')();
let db = require('./databaseConfig');
let cdn = require('./cdnConfig');
let recaptcha = require('./recaptchaConfig');
let geocoding = require('./geocodingConfig');
let email = require('./eMail/eMailQueue');
let version = require('./version');

function setStaticHeaders(config) {
    let staticMiddleware = config.get('middleware:static');
    staticMiddleware.module.arguments.push({
        setHeaders: function (res) {
            res.setHeader('X-Content-Type-Options', 'nosniff');
        }
    });
}


module.exports = function (app) {

    let env = process.env.NODE_ENV || 'development',
        elyoosMode = process.env.ELYOOS_MODE || 'development';
    app.on('middleware:before:json', function () {
        if ('testing' !== env) {
            app.use(function (req, res, next) {
                if (env === 'production' && elyoosMode !== 'production-admin' &&
                    req.headers.host.match(/^www/) === null) {
                    return res.redirect('https://www.' + req.headers.host + req.url, 301);
                }
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
            if ('production' === env) {
                app.use(csrf({
                    cookie: {
                        httpOnly: true,
                        secure: true
                    }
                }));
            } else {
                app.use(csrf());
            }
            app.use(function (req, res, next) {
                res.cookie('XSRF-TOKEN', req.csrfToken());
                next();
            });
        }
    });

    app.use(function (req, res, next) {
        let originalStatus = res.status;
        res.status = function (data) {
            if (req.headers.elyoosversion && req.headers.elyoosversion !== version.getVersion()) {
                data = 418;
            }
            return originalStatus.apply(this, [data]);
        };
        next();
    });

    if (process.env.NODE_ENV === 'development' || elyoosMode === 'production-admin') {
        app.get('/robots.txt', function (req, res) {
            res.type('text/plain');
            res.send("User-agent: *\nDisallow: /");
        });
    } else {
        app.get('/robots.txt', function (req, res) {
            res.type('text/plain');
            res.send("User-agent: *\nDisallow: ");
        });
    }

    return {
        onconfig: function (config, next) {

            let dbConfig = config.get('databaseConfig'),
                cdnConfig = config.get('cdnStore'),
                emailConfig = config.get('emailConfig'),
                recaptchaConfig = config.get('recaptcha'),
                geocodingConfig = config.get('geocoding');

            cdn.config(cdnConfig);
            db.config(dbConfig);
            email.config(emailConfig);
            recaptcha.config(recaptchaConfig);
            geocoding.config(geocodingConfig);

            setStaticHeaders(config);

            next(null, config);
        }
    };

};
