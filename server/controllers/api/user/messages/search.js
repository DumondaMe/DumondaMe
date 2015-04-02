'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var search = require('./../../../../models/messages/searchThread');
var exceptions = require('./../../../../lib/error/exceptions');
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

        if (req.query.maxItems && req.query.isSuggestion) {
            req.query.maxItems = parseInt(req.query.maxItems, 10);
            req.query.isSuggestion = req.query.isSuggestion === 'true';
        }

        return validation.validateQueryRequest(req, schemaRequestGetMessages, logger)
            .then(function (request) {
                return search.searchThreads(req.user.id, request.search, request.maxItems, request.isSuggestion);
            }).then(function (threads) {
                res.status(200).json(threads);
            }).catch(exceptions.InvalidJsonRequest, function () {
                res.status(400).end();
            }).catch(function (err) {
                logger.error('Searching messages failed', {error: err}, req);
                res.status(500).end();
            });
    });
};
