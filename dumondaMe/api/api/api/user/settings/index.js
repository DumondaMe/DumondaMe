'use strict';

const setting = requireModel('user/setting/setting');
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let userSetting = await setting.getUserSetting(req.user.id);
        logger.info("User requests the user setting", req);
        res.status(200).json(userSetting);
    }));
};
