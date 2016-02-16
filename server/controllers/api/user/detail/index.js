'use strict';

var validation = require('./../../../../lib/jsonValidation');
var userDetails = require('./../../../../models/user/detail/userDetails');
var auth = require('./../../../../lib/auth');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRequestGetUserDetails = {
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
                .then(function (userDetails) {
                    res.status(200).json(userDetails);
                });
        });
    });
};
