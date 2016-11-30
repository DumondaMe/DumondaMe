'use strict';

var validation = requireLib('jsonValidation');
var search = requireModel('user/searchUser');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

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
                logger.info("User searches user " + request.search + ", suggestion mode is " + request.isSuggestion, req);
                return search.searchUsers(req.user.id, request.search, request.maxItems, false);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
