'use strict';

let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let rateLimit = require('elyoos-server-lib').limiteRate;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let resetPassword = requireModel('eMailService/resetPassword');

let schemaRequestPasswordReset = {
    name: 'requestPasswordReset',
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255}
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

        return controllerErrors('Error occurs during password request reset', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestPasswordReset, logger).then(function (request) {
                logger.info(`Password reset request for address ${request.email}`);
                return resetPassword.sendReset(request.email);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};