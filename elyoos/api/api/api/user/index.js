'use strict';

const profile = requireModel('user/userProfile');
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let userProfile = await profile.getUserProfile(req.user.id, req);
        logger.info("User requests the user profile", req);
        res.status(200).json(userProfile);
    }));
};
