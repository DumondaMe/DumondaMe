'use strict';

const notification = requireModel('user/notification/notification');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let response = await notification.getNumberOfUnreadNotifications(req.user.id);
        res.status(200).json(response);
    }));
};
