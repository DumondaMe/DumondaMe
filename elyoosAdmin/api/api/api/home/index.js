'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const overview = requireModel('home/overview');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        logger.info(`Get home of admin ${req.user.id}`, req);
        const response = await overview.getOverview();
        res.status(200).json(response);
    }));
};
