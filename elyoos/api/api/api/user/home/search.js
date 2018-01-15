'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let search = requireModel('search/search');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaRequestSearchHome = {
    name: 'requestSearchHome',
    type: 'object',
    additionalProperties: false,
    required: ['search', 'maxItems'],
    properties: {
        search: {type: 'string', format: 'notEmptyString', maxLength: 300},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        isSuggestion: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when searching for a user, pages', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestSearchHome, logger).then(function (request) {
                logger.info("User searches user or page " + request.search + ", suggestion mode is " + request.isSuggestion, req);
                return search.search(req.user.id, request.search, request.maxItems, request.isSuggestion);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};