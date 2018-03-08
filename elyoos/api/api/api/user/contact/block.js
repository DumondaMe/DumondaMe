'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const contact = requireModel('user/contact/contact');
const auth = require('elyoos-server-lib').auth;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaBlockContact = {
    name: 'blockContact',
    type: 'object',
    additionalProperties: false,
    required: ['contactId'],
    properties: {
        contactId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/:contactId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaBlockContact, logger);
        logger.info(`User has blocked ${request.contactId}`, req);
        await contact.blockContact(req.user.id, request.contactId, req);
        res.status(200).end();
    }));

    router.delete('/:contactId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaBlockContact, logger);
        logger.info(`User removed blocking of ${request.contactId}`, req);
        await contact.unblockContact(req.user.id, request.contactId, req);
        res.status(200).end();
    }));
};
