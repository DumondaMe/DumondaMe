'use strict';

var passport = require('passport'),
    page = require('./../../../../models/user/page/page'),
    auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../lib/error/exceptions'),
    validation = require('./../../../../lib/jsonValidation');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {
        return page.getPages(req.user.id)
            .then(function (pages) {
                res.json(pages);
            }).catch(exceptions.InvalidJsonRequest, function () {
                res.status(400).end();
            }).catch(function (err) {
                logger.error('Get Request of Pages for a user failed', {error: err.errors}, req);
                res.status(500).end();
            });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {


    });
};
