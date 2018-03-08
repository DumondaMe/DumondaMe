'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let userProfileContactings = requireModel('user/profile/contacting');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaRequestGetUserDetailContactings = {
    name: 'getUserDetailContacting',
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

        return controllerErrors('Error when getting contacting in detail user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetUserDetailContactings, logger)
                .then(function (request) {
                    logger.info("User requests contacting of another user " + request.userId, req);
                    return userProfileContactings.getContacting(req.user.id, request.userId, request.maxItems, request.skip, req);
                })
                .then(function (userContactings) {
                    res.status(200).json(userContactings);
                });
        });
    });
};
