'use strict';

const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const profileImage = requireModel('userHarvesting/profile/profileImages');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await profileImage.generateProfileImage(req.files.file.path, req.user.id);
        logger.info("Harvesting user uploaded new profile image", req);
        res.status(200).end();
    }));
};
