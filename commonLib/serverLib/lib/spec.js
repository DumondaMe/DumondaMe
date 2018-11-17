'use strict';

let passport = require('passport');
let cookie = require('cookie-signature');
let auth = require('./auth');
let userLib = require('./user')();
let db = require('./databaseConfig');
let logger = require('./logging').getLogger(__filename);
let expressWinston = require('express-winston');
let winstonCloudWatch = require('winston-cloudwatch');
let winston = require('winston');

let cookieKey;
let cookieSecret;

const getLoggingTransport = function (jsonFormat) {
    let transports = [];
    if (process.env.NODE_ENV !== 'production') {
        transports.push(new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }));
    }
    if (process.env.CLOUD_WATCH_LOG_STREAM_NAME) {
        transports.push(new winstonCloudWatch({
            logGroupName: 'elyoosWebserver',
            logStreamName: process.env.CLOUD_WATCH_LOG_STREAM_NAME,
            level: 'info',
            jsonMessage: jsonFormat,
            awsRegion: process.env.AWS_REGION
        }));
    }
    return transports;
};


module.exports = function (app, nuxt) {

    app.get('/healthCheck', function (req, res) {
        res.type('text/plain');
        res.send("OK");
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
                req.session.save(async function () {
                    if (req.originalUrl.match(/api/) === null) {
                        try {
                            await nuxt.render(req, res);
                        } catch (err) {
                            logger.error('Nuxt rendering has failed', {error: err});
                        }
                    } else {
                        next();
                    }
                });
            });
        }
    });

    app.on('middleware:before:router', function () {
        app.use(expressWinston.logger({
            transports: getLoggingTransport(false)
        }));
    });

    app.on('middleware:after:router', function () {
        app.use(expressWinston.errorLogger({
            transports: getLoggingTransport(true),
            meta: true,
            msg: "HTTP {{req.method}} {{req.url}}",
            expressFormat: true,
            dynamicMeta: function(req) {
                return {
                    user: req.user ? req.user : null,
                    body: req.body ? req.body : null,
                };
            }
        }));
    });

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
