'use strict';
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const privacy = requireModel('user/setting/privacy');
const validation = require('elyoos-server-lib').jsonValidation;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;

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
        let request = await validation.validateRequest(req, schemaChangePrivacy, logger);
        logger.info(`User ${req.user.id} changes privacy settings`, req);
        await privacy.changePrivacySettings(req.user.id, request.privacyMode);
        res.status(200).end();
    }));
};
