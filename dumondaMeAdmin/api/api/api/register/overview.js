'use strict';

const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const overview = requireModel('register/overview');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;

const schemaGetRegisteredOverview = {
    name: 'getFeedbackRegisteredOverview',
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
        const params = await validation.validateRequest(req, schemaGetRegisteredOverview);
        logger.info("User requests feedback registered overview", req);
        const response = await overview.getOverview(params);
        res.status(200).json(response);
    }));
};
