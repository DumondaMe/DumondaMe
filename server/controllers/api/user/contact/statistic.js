'use strict';

var auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {
        req.user.id
        return;
    });
};