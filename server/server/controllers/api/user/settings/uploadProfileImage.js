'use strict';

var user = require('./../../../../models/user/user'),
    auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../../common/src/lib/error/exceptions'),
    saveProfileImage = require('./../../../../models/image/generateProfileImages'),
    gm = require('gm');

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return saveProfileImage.generateProfileImage(req.files.file.path, req.user.id)
            .then(function () {
                res.status(200).end();
            })
            .catch(function (err) {
                logger.error('Update of profile Image failed', {error: err.errors}, req);
                res.status(500).end();
            });
    });
};
