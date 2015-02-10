'use strict';
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var visibility = require('./../../../../../models/user/visibility');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return visibility.getVisibilitySettings(req.user.id).then(function (userVisibility) {
            res.status(200).json(userVisibility);
        }).catch(function (err) {
            logger.error('Getting user visibility settings failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
