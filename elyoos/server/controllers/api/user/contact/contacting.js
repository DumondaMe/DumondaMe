'use strict';

var validation = requireLib('jsonValidation');
var contacting = requireModel('contact/contacting');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRequestConnecting = {
    name: 'requestContacting',
    type: 'object',
    additionalProperties: false,
    required: ['maxItems', 'skip'],
    properties: {
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting contacting information', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestConnecting, logger).then(function (request) {
                logger.info("User requests contacting information", req);
                return contacting.getContacting(req.user.id, request.maxItems, request.skip);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
