'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var search = require('./../../../../models/messages/searchThread');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');

var schemaRequestGetMessages = {
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
                    logger.info("User " + req.user.id + " searches threads with " + request.search);
                    return search.searchThreads(req.user.id, request.search, request.maxItems, request.isSuggestion);
                }).then(function (threads) {
                    res.status(200).json(threads);
                });
        });
    });
};
