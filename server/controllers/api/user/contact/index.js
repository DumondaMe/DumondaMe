'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    search = require('./../../../../models/user/searchUser'),
    contact = require('./../../../../models/contact/contact'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestContact = {
    name: 'contactHandling',
    type: 'object',
    additionalProperties: false,
    required: ['contactIds', 'mode'],
    properties: {
        contactIds: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 30},
            minItems: 1,
            uniqueItems: true
        },
        mode: {enum: ['blockContact', 'addContact', 'changeState']},
        description: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

var schemaDeleteContact = {
    name: 'deleteContact',
    type: 'object',
    additionalProperties: false,
    required: ['contactId', 'mode'],
    properties: {
        contactId: {
            type: 'array',
            items: {type: 'string', maxLength: 30},
            format: 'notEmptyString',
            minItems: 1,
            uniqueItems: true
        },
        mode: {enum: ['blockContact', 'addContact', 'changeState']},
        description: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return contact.getContacts(req.user.id).then(function (contacts) {
            res.status(200).json(contacts);
        }).catch(function (err) {
            logger.error('Error when searching for a user', {error: err}, req);
            res.status(500).end();
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return validation.validateRequest(req, schemaRequestContact, logger).then(function (request) {
            if (request.mode === 'addContact') {
                if (!request.description) {
                    request.description = '';
                }
                return contact.addContact(req.user.id, request.contactIds, request.description);
            }
            if (request.mode === 'blockContact') {
                return contact.blockContact(req.user.id, request.contactIds);
            }
            if (request.mode === 'changeState') {
                return contact.changeContactState(req.user.id, request.contactIds, request.description);
            }
            logger.error('Unknown mode: ' + request.mode);
            res.status(500).end();
        }).then(function () {
            res.status(200).end();
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(exceptions.invalidOperation, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error occurs', {error: err}, req);
            res.status(500).end();
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {

        return validation.validateRequest(req, schemaDeleteContact, logger).then(function (request) {

        });
    });
};
