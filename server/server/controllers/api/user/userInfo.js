'use strict';

var user = require('./../../../models/user/user'),
    auth = require('./../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../common/src/lib/error/exceptions');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return user.getUserName(req.user.id, req.session.cookie._expires).then(function (userInfo) {
            res.status(200).json(userInfo);
        }).catch(function (err) {
            logger.error('Getting user info failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
