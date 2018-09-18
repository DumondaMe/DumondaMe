'use strict';

let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', function (req, res) {
        logger.info('logout of user', req, {});
        req.logout();
        res.status(200).end();
    });
};
