'use strict';

var logger = requireLogger.getLogger(__filename);
var rateLimit = require('../../../../lib/limiteRate');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');
var resetPassword = require('./../../../../models/user/password/resetPassword');

var schemaRequestPasswordReset = {
    name: 'passwordReset',
    type: 'object',
    additionalProperties: false,
    required: ['linkId', 'newPassword'],
    properties: {
        linkId: {type: 'string', format: 'notEmptyString', minLength: 64, maxLength: 64},
        newPassword: {type: 'string', format: 'passwordString', maxLength: 55, minLength: 8}
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

        return controllerErrors('Error occurs during password reset', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestPasswordReset, logger).then(function (request) {
                logger.info(`Password reset for linkId ${request.email}`);
                return resetPassword.resetPassword(request.linkId, request.newPassword, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
