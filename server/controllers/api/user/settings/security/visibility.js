'use strict';

var user = require('./../../../../../models/user/user'),
    auth = require('./../../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../../lib/error/exceptions'),
    validation = require('./../../../../../lib/jsonValidation');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        res.status(500).end();
        /*return user.getUserProfile(req.user.id).then(function (user) {
         res.status(200).json(user);
         }).catch(function (err) {
         logger.error('Getting profile data failed', {error: err.errors}, req);
         res.status(500).end();
         });*/
    });
};
