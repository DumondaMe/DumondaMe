'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var privacy = require('./../../../../models/user/privacy');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return privacy.getPrivacySettings(req.user.id).then(function (userPrivacy) {
            res.status(200).json(userPrivacy);
        }).catch(function (err) {
            logger.error('Getting user Privacy settings failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
