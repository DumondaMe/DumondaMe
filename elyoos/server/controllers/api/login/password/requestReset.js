'use strict';

var logger = requireLogger.getLogger(__filename);
var rateLimit = requireLib('limiteRate');
var controllerErrors = requireLib('error/controllerErrors');
var validation = requireLib('jsonValidation');
var resetPassword = requireModel('eMailService/resetPassword');

var schemaRequestPasswordReset = {
    name: 'requestPasswordReset',
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255}
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
