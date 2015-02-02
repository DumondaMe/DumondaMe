'use strict';


var passport = require('passport'),
    logger = requireLogger.getLogger(__filename);


module.exports = function (router) {

    router.post('/', function (req, res) {

        logger.info('Start login');
        passport.authenticate('local', function (err, user) {

            if (err) {
                logger.error('Authentication of user failed', {error: err});
                return res.status(500).end();
            }
            if (!user) {
                logger.warn('User not allowed to login', {httpStatusCode: 400});
                return res.status(400).end();
            }

            req.logIn(user, function (errLogin) {
                if (errLogin) {
                    logger.error('Login of User failed', {error: errLogin}, req);
                    return res.status(500).end();
                }
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
                res.status(200).json({"username": user.email});
                logger.info('Successful login of User ', {}, req);
            });

        })(req, res);
    });
};
