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
    required: ['userId'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        return validation.validateQueryRequest(req, schemaRequestGetContactDetails, logger)
            .then(function (request) {
                return contactDetails.getContactDetails(req.user.id, request.userId, req.session.cookie._expires);
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
