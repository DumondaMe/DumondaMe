'use strict';

const logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', function (req, res) {
        const env = process.env.NODE_ENV || 'development';
        logger.info('logout of user', req, {});
        req.logout();
        if ('testing' !== env) {
            req.session.destroy();
        }
        res.status(200).end();
    });
};
