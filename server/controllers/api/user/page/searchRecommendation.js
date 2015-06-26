'use strict';

var validation = require('./../../../../lib/jsonValidation');
var searchPage = require('./../../../../models/page/searchPage');
var auth = require('./../../../../lib/auth');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetPage = {
    name: 'searchUserPageRecommendations',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'search'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        search: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 255}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when searching page recommendations of the user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                logger.info('Request search page recommendations of user', req);
                return searchPage.searchUserRecommendedPage(req.user.id, request.search, request.skip, request.maxItems);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
