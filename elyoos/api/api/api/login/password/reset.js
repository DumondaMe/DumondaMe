'use strict';

let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let rateLimit = require('elyoos-server-lib').limiteRate;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let resetPassword = requireModel('user/password/resetPassword');

let schemaRequestPasswordReset = {
    name: 'passwordReset',
    type: 'object',
    additionalProperties: false,
    required: ['linkId', 'newPassword'],
    properties: {
        linkId: {type: 'string', format: 'notEmptyString', minLength: 64, maxLength: 64},
        newPassword: {type: 'string', format: 'passwordString', maxLength: 55, minLength: 8}
    }
};

let apiLimiter = rateLimit.getRate({
    windowMs: 60 * 60 * 1000, // 60 minutes
    delayAfter: 3,
    delayMs: 3 * 1000,
    max: 10
});

module.exports = function (router) {

    router.post('/', apiLimiter, function (req, res) {

        return controllerErrors('Error occurs during password reset', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestPasswordReset, logger).then(function (request) {
                logger.info(`Password reset for linkId ${request.linkId}`);
                return resetPassword.resetPassword(request.linkId, request.newPassword, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
