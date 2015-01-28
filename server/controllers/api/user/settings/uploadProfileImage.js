'use strict';

var user = require('./../../../../models/user/user'),
    auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../lib/error/exceptions'),
    gm = require('gm');

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        gm(req.files.file.path)
            .thumbAsync(100, 100, 'c:\\temp\\test.jpg', 90)
            .then(function () {
                return gm(req.files.file.path).thumbAsync(35, 35, 'c:\\temp\\test2.jpg', 95);
            })
            .then(function () {
                return gm(req.files.file.path).thumbAsync(350, 350, 'c:\\temp\\test3.jpg', 92);
            })
            .then(function () {
                res.status(200).end();
            })
            .catch(function (err) {
                logger.error('Update of profile Image failed', {error: err.errors}, req);
                res.status(500).end();
            });
    });
};
