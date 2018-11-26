'use strict';

const image = requireModel('user/profile/image');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let userImage = await image.getUserImage(req.user.id);
        res.status(200).json(userImage);
    }));
};
