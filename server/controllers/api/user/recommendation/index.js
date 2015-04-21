'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    recommendation = require('./../../../../models/recommendation/recommendation'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    controllerErrors = require('./../../../../lib/error/controllerErrors'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestGetRecommendations = {
    name: 'getRecommendations',
    type: 'object',
    additionalProperties: false,
    required: ['itemsPerPage', 'skip'],
    properties: {
        itemsPerPage: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        return validation.validateQueryRequest(req, schemaRequestGetRecommendations, logger)
            .then(function (request) {
                return recommendation.getUserRecommendations(req.user.id, request.skip, request.itemsPerPage);
            })
            .then(function (userRecommendations) {
                logger.info("Get recommendations of the user", req);
                res.status(200).json(userRecommendations);
            }).catch(function (err) {
                logger.error('Error when getting the recommendations of the user', req, {error: err});
                res.status(500).end();
            });
    });
};
