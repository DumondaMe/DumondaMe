'use strict';
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const privacy = requireModel('user/setting/privacy');
const validation = require('dumonda-me-server-lib').jsonValidation;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaChangePrivacy = {
    name: 'changePrivacy',
    type: 'object',
    additionalProperties: false,
    required: ['privacyMode'],
    properties: {
        privacyMode: {enum: ['public', 'publicEl', 'onlyContact']},
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaChangePrivacy);
        logger.info(`User ${req.user.id} changes privacy settings`, req);
        await privacy.changePrivacySettings(req.user.id, request.privacyMode);
        res.status(200).end();
    }));
};
