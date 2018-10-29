'use strict';

const user = requireModel('user/question/askedQuestion');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;


module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let hasAskedQuestion = await user.hasAskedQuestion(req.user.id);
        res.status(200).json(hasAskedQuestion);
    }));
};
