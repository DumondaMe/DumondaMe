'use strict';

var validation = require('./../../../lib/jsonValidation');
var searchKeyword = require('./../../../models/keyword/search');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaSearchPage = {
    name: 'suggestKeyword',
    type: 'object',
    additionalProperties: false,
    required: ['search'],
    properties: {
        search: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 255}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when suggesting a keyword', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaSearchPage, logger).then(function (request) {
                logger.info('Search for a keyword: ' + request.search, req);
                return searchKeyword.searchKeywords(request.search);
            }).then(function (keywords) {
                res.status(200).json(keywords);
            });
        });
    });
};
