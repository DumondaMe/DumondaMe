'use strict';

let sameContact = requireModel('user/contact/sameContact');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetSameContact = {
    name: 'getSameContact',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'maxItems', 'skip'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting same contact', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetSameContact, logger).then(function (request) {
                logger.info(`User requests same contact for user ${request.userId}`, req);
                return sameContact.getSameContact(req.user.id, request);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
