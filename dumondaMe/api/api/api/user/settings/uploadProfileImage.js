'use strict';

let auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
let saveProfileImage = requireModel('image/generateProfileImages');

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await saveProfileImage.generateProfileImage(req.files.file.path, req.user.id);
        logger.info("User uploaded new profile image", req);
        res.status(200).end();
    }));
};
