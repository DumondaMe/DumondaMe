'use strict';

var user = require('./../../../../../models/user/user'),
    auth = require('./../../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../../lib/error/exceptions'),
    validation = require('./../../../../../lib/jsonValidation');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        res.status(500).end();
    });
};
