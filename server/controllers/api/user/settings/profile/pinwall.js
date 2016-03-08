'use strict';

var pinwall = require('./../../../../../models/user/pinwall/pinwall');
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var controllerErrors = require('./../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../lib/jsonValidation');

var schemaGetPinwallOfUser = {
    name: 'getPinwallOfUser',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting pinwall of the user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPinwallOfUser, logger).then(function (request) {
                logger.info('Request pinwall of user', req);
                return pinwall.getPinwallOfUser(req.user.id, request, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
