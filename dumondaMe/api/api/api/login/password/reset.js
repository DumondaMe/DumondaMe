'use strict';

const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const rateLimit = require('dumonda-me-server-lib').limiteRate;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;
const resetPassword = requireModel('user/password/resetPassword');

const schemaRequestPasswordReset = {
    name: 'passwordReset',
    type: 'object',
    additionalProperties: false,
    required: ['linkId', 'newPassword'],
    properties: {
        linkId: {type: 'string', format: 'notEmptyString', maxLength: 200},
        newPassword: {type: 'string', format: 'passwordString', maxLength: 55, minLength: 8}
    }
};

const apiLimiter = rateLimit.getRate({
    windowMs: 60 * 60 * 1000, // 60 minutes
    delayAfter: 3,
    delayMs: 3 * 1000,
    max: 10
});

module.exports = function (router) {

    router.post('/', apiLimiter, asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestPasswordReset, logger);
        logger.info(`Password reset for linkId ${request.linkId}`);
        await resetPassword.resetPassword(request.linkId, request.newPassword, req);
        res.status(200).end();
    }));
};
