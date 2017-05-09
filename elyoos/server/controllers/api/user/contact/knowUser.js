'use strict';
/**
 * @file
 * API to get the number of contacts which know the user
 */

let knownUser = requireModel('user/contact/knowUser');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetKnowUser = {
    name: 'getKnowUser',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'maxItems', 'skip'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting known users', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetKnowUser, logger).then(function (request) {
                logger.info(`User requests known users for user ${request.userId}`, req);
                return knownUser.getKnownUser(req.user.id, request);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
