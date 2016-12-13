'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var searchPage = requireModel('page/searchPage');
var auth = require('elyoos-server-lib').auth;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var schemaSearchPage = {
    name: 'searchPage',
    type: 'object',
    additionalProperties: false,
    required: ['search', 'isSuggestion', 'skip', 'maxItems'],
    properties: {
        search: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 255},
        isSuggestion: {type: 'boolean'},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        filterType: {
            type: 'array',
            items: {enum: ['Book', 'Youtube', 'Link']},
            minItems: 1,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        if (req.query.filterType && typeof req.query.filterType === 'string') {
            req.query.filterType = req.query.filterType.split(',');
        }

        return controllerErrors('Error occurs when searching for a page', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaSearchPage, logger).then(function (request) {
                logger.info('Search for a page: ' + request.search, req);
                return searchPage.searchPage(req.user.id,
                    request.search, request.filterType, request.skip, request.maxItems, request.isSuggestion);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
