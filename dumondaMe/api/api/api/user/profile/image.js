'use strict';

const image = requireModel('user/profile/image');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const profileImage = requireModel('user/profile/profileImages');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let userImage = await image.getUserImage(req.user.id);
        res.status(200).json(userImage);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await profileImage.generateProfileImage(req.files.file.path, req.user.id);
        logger.info("User uploaded new profile image", req);
        res.status(200).end();
    }));
};
