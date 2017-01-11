'use strict';

let user = require('elyoos-server-lib').user();
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', function (req, res) {
        let env = process.env.NODE_ENV || 'development';
        logger.info('logout of user', req, {});
        req.logout();
        user.removeFromCache(req.email);
        if ('testing' !== env) {
            req.session.destroy();
        }
        res.status(200).end();
    });
};
