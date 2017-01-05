'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let page = requireModel('page/pageRecommendation');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        filters: {
            type: 'array',
            items: {enum: ['Book', 'Video']},
            minItems: 1,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        if (req.query.filters && typeof req.query.filters === 'string') {
            req.query.filters = req.query.filters.split(',');
        }

        return controllerErrors('Error occurs when getting contact recommendations', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                logger.info('Request contact recommendations', req);
                return page.getRecommendationContacts(req.user.id, request.skip, request.maxItems, request.filters);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
