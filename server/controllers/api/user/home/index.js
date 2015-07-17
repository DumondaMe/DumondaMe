'use strict';

var validation = require('./../../../../lib/jsonValidation');
var auth = require('./../../../../lib/auth');
var pinwall = require('./../../../../models/user/home/pinwall');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetAdministratedPages = {
    name: 'getHomeInfos',
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

        return controllerErrors('Error occurs when getting users home infos', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetAdministratedPages, logger).then(function (request) {
                logger.info('Request home of user', req);
                return pinwall.getPinwall(req.user.id, request, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
