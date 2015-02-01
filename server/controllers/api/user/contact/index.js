'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    search = require('./../../../../models/user/searchUser'),
    contact = require('./../../../../models/contact/contact'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestGetContact = {
    name: 'getContacts',
    type: 'object',
    additionalProperties: false,
    required: ['itemsPerPage', 'skip'],
    properties: {
        itemsPerPage: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0},
        types: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 30},
            minItems: 1,
            maxItems: 10,
            uniqueItems: true
        }
    }
};

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
            maxItems: 50,
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
    required: ['contactIds'],
    properties: {
        contactIds: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 30},
            minItems: 1,
            maxItems: 50,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        if (req.query.itemsPerPage && req.query.skip) {
            req.query.itemsPerPage = parseInt(req.query.itemsPerPage, 10);
            req.query.skip = parseInt(req.query.skip, 10);
        }
        if (req.query.types && typeof req.query.types === 'string') {
            req.query.types = req.query.types.split(',');
        }

        return validation.validateQueryRequest(req, schemaRequestGetContact, logger)
            .then(function (request) {
                if (!req.query.types) {
                    return contact.getContactsNormal(req.user.id, request.itemsPerPage, request.skip, req.session.cookie._expires)
                        .then(function (contacts) {
                            var data = {};
                            data.contacts = contacts[0];
                            data.statistic = contacts[1];
                            data.numberOfContacts = contacts[2][0].numberOfContacts;
                            data.contactsForPagination = data.numberOfContacts;

                            res.status(200).json(data);
                        });
                }
                return contact.getContactForTypes(req.user.id, request.itemsPerPage, request.skip, req.query.types, req.session.cookie._expires)
                    .then(function (contacts) {
                        var data = {};
                        data.contacts = contacts[0];
                        data.contactsForPagination = contacts[1][0].contactsForPagination;

                        res.status(200).json(data);
                    });
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
        }).then(function (data) {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(200).end();
            }
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
            return contact.deleteContact(req.user.id, request.contactIds);
        }).then(function (statistic) {
            res.status(200).json(statistic);
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error occurs while deleting contact relationship', {error: err}, req);
            res.status(500).end();
        });
    });
};
