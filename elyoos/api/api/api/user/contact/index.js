'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const contact = requireModel('user/contact/contact');
const auth = require('elyoos-server-lib').auth;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRequestContact = {
    name: 'contactHandling',
    type: 'object',
    additionalProperties: false,
    required: ['contactId'],
    properties: {
        contactId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/:contactId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestContact, logger);
        logger.info(`User has added ${request.contactId} to the contact list`, req);
        let result = await contact.addContact(req.user.id, request.contactId, req);
        res.status(200).json(result);
    }));

    router.delete('/:contactId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestContact, logger);
        logger.info(`User removed ${request.contactId} from the contact list`, req);
        await contact.deleteContact(req.user.id, request.contactId, req);
        res.status(200).end();
    }));
};
