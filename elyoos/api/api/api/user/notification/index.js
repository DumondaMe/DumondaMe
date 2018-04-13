'use strict';

const notification = requireModel('user/notification/notification');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);


module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let response = await notification.getNotifications(req.user.id);
        res.status(200).json(response);
    }));
};
