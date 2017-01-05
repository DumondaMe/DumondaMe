'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let pageRecommendation = requireModel('page/pageRecommendation');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'userId'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        filters: {
            type: 'array',
            items: {enum: ['Book', 'Youtube']},
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

        return controllerErrors('Error occurs when getting recommendations of another user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                logger.info('Request recommendations of another user', req);
                return pageRecommendation.getRecommendationOtherUser(req.user.id, request.userId, request.skip, request.maxItems, request.filters);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
