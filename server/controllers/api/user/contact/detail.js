'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    contactDetails = require('./../../../../models/contact/contactDetails'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestGetContactDetails = {
    name: 'getContactDetails',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'contactsPerPage', 'skipContacts', 'mode'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        contactsPerPage: {type: 'integer', minimum: 1, maximum: 50},
        skipContacts: {type: 'integer', minimum: 0},
        mode: {enum: ['detailOfUser', 'onlyContacts']}
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        if (req.query.contactsPerPage && req.query.skipContacts) {
            req.query.contactsPerPage = parseInt(req.query.contactsPerPage, 10);
            req.query.skipContacts = parseInt(req.query.skipContacts, 10);
        }

        return validation.validateQueryRequest(req, schemaRequestGetContactDetails, logger)
            .then(function (request) {
                if (request.mode === 'detailOfUser') {
                    return contactDetails.getContactDetails(req.user.id,
                        request.userId, request.contactsPerPage, request.skipContacts);
                }
                if (request.mode === 'onlyContacts') {
                    return contactDetails.getContacts(req.user.id,
                        request.userId, request.contactsPerPage, request.skipContacts);
                }
            })
            .then(function (userDetails) {
                res.status(200).json(userDetails);
            }).catch(exceptions.InvalidJsonRequest, function () {
                res.status(400).end();
            }).catch(function (err) {
                logger.error('Error when searching for a user', {error: err}, req);
                res.status(500).end();
            });
    });
};
