'use strict';

let passport = require('passport');
let loginUser = requireModel('user/loginUser');
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
let rateLimit = require('dumonda-me-server-lib').limiteRate;
let _ = require('lodash');

let apiLimiter = rateLimit.getRate({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50
});

module.exports = function (router) {

    router.post('/', apiLimiter, function (req, res) {
        if (req.body && _.isString(req.body.username)) {
            req.body.username = req.body.username.toLowerCase();
        }
        passport.authenticate('local', function (err, user) {

            if (err) {
                logger.error('Authentication of user failed', req, {error: err});
                return res.status(500).end();
            }
            if (!user) {
                logger.warn('User not allowed to login', req, {httpStatusCode: 400});
                return res.status(400).end();
            }

            req.logIn(user, async function (errLogin) {
                if (errLogin) {
                    logger.error('Login of user failed', req, {error: errLogin});
                    return res.status(500).end();
                }

                try {
                    await loginUser.setTimestamp(req.user.id);
                    res.status(200).json({
                        username: user.email, lang: user.lang, languages: user.languages,
                        infoState: user.infoState, topics: user.topics, regions: user.regions,
                        isHarvestingUser: user.harvestingUser
                    });
                    logger.info(`Successful login of user ${req.user.id}`, req, {});
                } catch (error) {
                    logger.error('Setting Timestamp failed', req, {error: error});
                    res.status(500).end();
                }
            });

        })(req, res);
    });
};
