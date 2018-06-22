'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const overview = requireModel('news/overview');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;

const schemaGetNewsOverview = {
    name: 'getNewsOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetNewsOverview, logger);
        logger.info("User requests news overview", req);
        const response = await overview.getOverview(params);
        res.status(200).json(response);
    }));
};
