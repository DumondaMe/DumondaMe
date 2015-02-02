'use strict';
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        res.status(500).end();
    });
};
