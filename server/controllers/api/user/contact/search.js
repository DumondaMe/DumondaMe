'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    search = require('./../../../../models/user/searchUser'),
    contact = require('./../../../../models/contact/contact'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    controllerErrors = require('./../../../../lib/error/controllerErrors'),
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

        return controllerErrors('Error when searching for a user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestSearchUser, logger).then(function (request) {
                logger.info("User " + req.user.id + " searches user " + request.search);
                return search.searchUsers(req.user.id, request.search, request.maxItems, request.isSuggestion);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
