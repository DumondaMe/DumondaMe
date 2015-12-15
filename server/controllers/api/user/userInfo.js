'use strict';

var user = require('./../../../models/user/user'),
    auth = require('./../../../lib/auth'),
    logger = requireLogger.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return user.getUserInfo(req.user.id, req).then(function (userInfo) {
            logger.info("User requested user name", req);
            res.status(200).json(userInfo);
        }).catch(function (err) {
            logger.error('Getting user info failed', req, {error: err.errors});
            res.status(500).end();
        });
    });
};
