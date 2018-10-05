'use strict';

let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
let rateLimit = require('dumonda-me-server-lib').limiteRate;
let controllerErrors = require('dumonda-me-server-lib').controllerErrors;
let validation = require('dumonda-me-server-lib').jsonValidation;
let verifyUserRequest = requireModel('register/verifyRegisterUserRequest');

let schemaRequestPasswordReset = {
    name: 'passwordReset',
    type: 'object',
    additionalProperties: false,
    required: ['linkId'],
    properties: {
        linkId: {type: 'string', format: 'notEmptyString', maxLength: 200}
    }
};

let apiLimiter = rateLimit.getRate({
    windowMs: 60 * 60 * 1000, // 60 minutes
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
