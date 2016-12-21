'use strict';

var user = require('elyoos-server-lib').user();
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', function (req, res) {
        var env = process.env.NODE_ENV || 'development';
        logger.info('logout of user', req, {});
        req.logout();
        user.removeFromCache(req.email);
        if ('testing' !== env) {
            req.session.destroy();
        }
        res.status(200).end();
    });
};
