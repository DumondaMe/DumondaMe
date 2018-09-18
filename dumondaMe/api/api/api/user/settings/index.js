'use strict';

const setting = requireModel('user/setting/setting');
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let userSetting = await setting.getUserSetting(req.user.id);
        logger.info("User requests the user setting", req);
        res.status(200).json(userSetting);
    }));
};
