'use strict';


var passport = require('passport'),
    user = require('../../../lib/user')(),
    logger = requireLogger.getLogger(__filename);


module.exports = function (router) {

    router.post('/', function (req, res) {
        logger.info('logout of user', {}, req);
        req.logout();
        user.removeFromCache(req.email);
        res.status(200).end();
    });
};
