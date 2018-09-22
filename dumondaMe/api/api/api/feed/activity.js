'use strict';

const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;


module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        res.status(401).end();
    }));
};
