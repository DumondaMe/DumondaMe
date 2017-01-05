'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let saveProfileImage = requireModel('image/generateProfileImages');

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return saveProfileImage.generateProfileImage(req.files.file.path, req.user.id)
            .then(function () {
                logger.info("User uploaded new profile image", req);
                res.status(200).end();
            })
            .catch(function (err) {
                logger.error('Update of profile Image failed', req, {error: err.errors});
                res.status(500).end();
            });
    });
};
