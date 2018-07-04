'use strict';

const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const rateLimit = require('elyoos-server-lib').limiteRate;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;
const resetPassword = requireModel('eMailService/resetPassword');

const schemaRequestPasswordReset = {
    name: 'requestPasswordReset',
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255}
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
        logger.info(`Password reset request for email address ${request.email}`);
        await resetPassword.sendReset(request.email);
        res.status(200).end();
    }));
};
