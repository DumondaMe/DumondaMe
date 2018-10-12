'use strict';

let passport = require('passport');
let cookie = require('cookie-signature');
let auth = require('./auth');
let userLib = require('./user')();
let db = require('./databaseConfig');
let logger = require('./logging').getLogger(__filename);
let cookieKey;
let cookieSecret;

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
