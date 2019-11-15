'use strict';
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const email = requireModel('eMailService/newEmailRequest');
const validation = require('dumonda-me-server-lib').jsonValidation;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaEmailSetting = {
    name: 'changeEmailSetting',
    type: 'object',
    additionalProperties: false,
    required: ['newEMailAddress'],
    properties: {
        newEMailAddress: {type: 'string', format: 'email', maxLength: 255}
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaEmailSetting);
        logger.info(`User ${req.user.id} changes email address`, req);
        await email.sendNewEmailRequest(req.user.id, request.newEMailAddress);
        res.status(200).end();
    }));
};
