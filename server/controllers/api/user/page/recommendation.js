'use strict';

var validation = require('./../../../../lib/jsonValidation');
var page = require('./../../../../models/page/pageRecommendation');
var auth = require('./../../../../lib/auth');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetPage = {
    name: 'getPageRecommendations',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting page recommendations of the user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                logger.info('Request page recommendations of user', req);
                return page.getRecommendationUser(req.user.id, request.skip, request.maxItems);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
