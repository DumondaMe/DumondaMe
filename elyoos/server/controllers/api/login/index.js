'use strict';

var passport = require('passport');
var modification = requireModel('modification/modification');
var loginUser = requireModel('user/loginUser');
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
let rateLimit = require('elyoos-server-lib').limiteRate;

var apiLimiter = rateLimit.getRate({
    windowMs: 10 * 60 * 1000, // 10 minutes
    delayAfter: 3,
    delayMs: 3 * 1000,
    max: 50
});

module.exports = function (router) {

    router.post('/', apiLimiter, function (req, res) {

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

                loginUser.setTimestamp(req.user.id).then(function () {
                    modification.initModificationOnSession(req.user.id, req.session, function () {
                        res.status(200).json({"username": user.email});
                        logger.info(`Successful login of user ${req.user.id}`, req, {});
                    });
                }).catch(function (errTimestamp) {
                    logger.error('Setting Timestamp failed', req, {error: errTimestamp});
                    res.status(500).end();
                });
            });

        })(req, res);
    });
};
