'use strict';

let contactRecommendation = requireModel('user/contact/contactRecommendation');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetContactRecommendation = {
    name: 'getContactRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['skipInvitedUser', 'skipRecommendedByContact', 'skipRecommended', 'maxItemsPerType'],
    properties: {
        maxItemsPerType: {type: 'integer', minimum: 1, maximum: 50},
        skipInvitedUser: {type: 'integer', minimum: 0},
        skipRecommendedByContact: {type: 'integer', minimum: 0},
        skipRecommended: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting recommended user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetContactRecommendation, logger).then(function (request) {
                logger.info("User requests recommend user", req);
                return contactRecommendation.getContactRecommendation(req.user.id, request);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
