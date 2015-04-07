'use strict';


var passport = require('passport');
var modification = require('../../../models/modification/modification');
var logger = requireLogger.getLogger(__filename);


module.exports = function (router) {

    router.post('/', function (req, res) {

        passport.authenticate('local', function (err, user) {

            if (err) {
                logger.error('Authentication of user failed', req, {error: err});
                return res.status(500).end();
            }
            if (!user) {
                logger.warn('User not allowed to login', req, {httpStatusCode: 400});
                return res.status(400).end();
            }

            req.logIn(user, function (errLogin) {
                if (errLogin) {
                    logger.error('Login of user failed', req, {error: errLogin});
                    return res.status(500).end();
                }

                modification.initModificationOnSession(req.user.id, req.session, function () {
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 12;
                    res.status(200).json({"username": user.email});
                    logger.info('Successful login of user', req, {});
                });
            });

        })(req, res);
    });
};
