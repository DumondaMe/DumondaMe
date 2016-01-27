'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    contact = require('./../../../../models/contact/contact'),
    auth = require('./../../../../lib/auth'),
    controllerErrors = require('./../../../../lib/error/controllerErrors'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestGetContact = {
    name: 'getContacts',
    type: 'object',
    additionalProperties: false,
    required: ['maxItems', 'skip'],
    properties: {
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
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
        mode: {enum: ['blockContact', 'unblockContact', 'addContact', 'changeState']},
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
            maxItems: 30,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        if (req.query.types && typeof req.query.types === 'string') {
            req.query.types = req.query.types.split(',');
        }

        return validation.validateQueryRequest(req, schemaRequestGetContact, logger)
            .then(function (request) {
                if (!req.query.types) {
                    return contact.getContactsNormal(req.user.id, request.maxItems, request.skip)
                        .then(function (contacts) {
                            logger.info("Get contacts for user in normal mode", req);
                            res.status(200).json(contacts);
                        });
                }
                return contact.getContactForTypes(req.user.id, request.maxItems, request.skip, req.query.types)
                    .then(function (contacts) {
                        logger.info("Get contacts for user in types mode", req);
                        res.status(200).json(contacts);
                    });
            }).catch(function (err) {
                logger.error('Error when searching for a user', req, {error: err});
                res.status(500).end();
            });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestContact, logger).then(function (request) {
                if (request.mode === 'addContact') {
                    if (!request.description) {
                        request.description = '';
                    }
                    logger.info("User has added " + request.contactIds + " as " + request.description + " to the contact list", req);
                    return contact.addContact(req.user.id, request.contactIds, request.description, req);
                }
                if (request.mode === 'blockContact') {
                    logger.info("User has blocked " + request.contactIds + " users", req);
                    return contact.blockContact(req.user.id, request.contactIds, req);
                }
                if (request.mode === 'unblockContact') {
                    logger.info("User has unblocked " + request.contactIds + " users", req);
                    return contact.unblockContact(req.user.id, request.contactIds, req);
                }
                if (request.mode === 'changeState') {
                    logger.info("User has changed state of " + request.contactIds + " to " + request.description, req);
                    return contact.changeContactState(req.user.id, request.contactIds, request.description, req);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                if (data) {
                    res.status(200).json(data);
                } else {
                    res.status(200).end();
                }
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting contact relationship', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteContact, logger).then(function (request) {
                return contact.deleteContact(req.user.id, request.contactIds, req);
            }).then(function (statistic) {
                res.status(200).json(statistic);
            });
        });
    });
};
