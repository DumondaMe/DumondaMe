'use strict';
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let search = requireModel('messages/searchThread');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaRequestGetMessages = {
    name: 'searchMessages',
    type: 'object',
    additionalProperties: false,
    required: ['search', 'maxItems', 'isSuggestion'],
    properties: {
        search: {type: 'string', format: 'notEmptyString', maxLength: 300},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        isSuggestion: {type: 'boolean'}
    }
};

module.exports = function (router) {


    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Searching messages failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetMessages, logger)
                .then(function (request) {
                    logger.info("User searches threads with " + request.search, req);
                    return search.searchThreads(req.user.id, request.search, request.maxItems, request.isSuggestion);
                }).then(function (threads) {
                    res.status(200).json(threads);
                });
        });
    });
};
