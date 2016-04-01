'use strict';

var validation = require('./../../../../lib/jsonValidation');
var userDetailContacts = require('./../../../../models/user/detail/contact');
var auth = require('./../../../../lib/auth');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRequestGetUserDetailContacts = {
    name: 'getUserDetailContacts',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting contact in detail user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetUserDetailContacts, logger)
                .then(function (request) {
                    logger.info("User requests contacts of another user " + request.userId, req);
                    return userDetailContacts.getContacts(req.user.id, request.userId, request.maxItems, request.skip, req);
                })
                .then(function (userContacts) {
                    res.status(200).json(userContacts);
                });
        });
    });
};
