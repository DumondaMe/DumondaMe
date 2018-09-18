'use strict';

const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const schemaLanguage = require("../../../schema/language");
const rateLimit = require('dumonda-me-server-lib').limiteRate;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;
const resetPassword = requireModel('eMailService/resetPassword');

const schemaRequestPasswordReset = {
    name: 'requestPasswordReset',
    type: 'object',
    additionalProperties: false,
    required: ['email', 'language'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255},
        language: schemaLanguage.language,
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
        await resetPassword.sendReset(request.email, request.language);
        res.status(200).end();
    }));
};
