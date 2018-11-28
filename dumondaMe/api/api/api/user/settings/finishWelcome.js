'use strict';
const auth = require('dumonda-me-server-lib').auth;
const welcome = requireModel('user/setting/welcome');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await welcome.welcomeFinish(req.user.id, req);
        res.status(200).end();
    }));
};
