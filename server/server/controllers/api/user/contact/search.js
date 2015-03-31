'use strict';

var validation = require('./../../../../../common/src/lib/jsonValidation'),
    search = require('./../../../../models/user/searchUser'),
    contact = require('./../../../../models/contact/contact'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../../common/src/lib/error/exceptions'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestSearchUser = {
    name: 'requestSearchUser',
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
        return validation.validateQueryRequest(req, schemaRequestSearchUser, logger).then(function (request) {
            return search.searchUsers(req.user.id, request.search, request.maxItems, request.isSuggestion);
        }).then(function (users) {
            res.status(200).json(users);
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error when searching for a user', {error: err}, req);
            res.status(500).end();
        });
    });
};
