'use strict';

var logger = require('elyoos-server-lib').logging.getLogger(__filename);
let rateLimit = require('elyoos-server-lib').limiteRate;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var validation = require('elyoos-server-lib').jsonValidation;
var verifyUserRequest = requireModel('register/verifyRegisterUserRequest');

var schemaRequestPasswordReset = {
    name: 'passwordReset',
    type: 'object',
    additionalProperties: false,
    required: ['linkId'],
    properties: {
        linkId: {type: 'string', format: 'notEmptyString', minLength: 64, maxLength: 64}
    }
};

var apiLimiter = rateLimit.getRate({
    windowMs: 60 * 60 * 1000, // 60 minutes
    delayAfter: 3,
    delayMs: 3 * 1000,
    max: 10
});

module.exports = function (router) {

    router.post('/', apiLimiter, function (req, res) {

        return controllerErrors('Error occurs during verification of user email address', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestPasswordReset, logger).then(function (request) {
                logger.info(`Email verification for linkId ${request.linkId}`);
                return verifyUserRequest.verify(request.linkId, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
