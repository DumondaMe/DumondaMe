'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let userDetails = requireModel('user/detail/userDetails');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaRequestGetUserDetails = {
    name: 'getUserDetails',
    type: 'object',
    additionalProperties: false,
    required: ['userId'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting detail of a user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetUserDetails, logger)
                .then(function (request) {
                    logger.info("User requests detail information for user " + request.userId, req);
                    return userDetails.getUserDetails(req.user.id, request.userId, req);

                })
                .then(function (userDetailResp) {
                    res.status(200).json(userDetailResp);
                });
        });
    });
};
