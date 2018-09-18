'use strict';

const passport = require('passport');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const rateLimit = require('elyoos-server-lib').limiteRate;

const apiLimiter = rateLimit.getRate({
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
            if(!user.elyoosAdmin) {
                logger.warn('User not allowed to login. Is not elyoos admin.', req, {httpStatusCode: 400});
                return res.status(400).end();
            }

            req.logIn(user, function (errLogin) {
                if (errLogin) {
                    logger.error('Login of user failed', req, {error: errLogin});
                    return res.status(500).end();
                }

                logger.info('Successful login of user', req, {});
                res.status(200).json({"username": user.email});
            });

        })(req, res);
    });
};
