'use strict';

var validation = requireLib('jsonValidation');
var pageAdministrator = requireModel('page/pageAdministrator');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetAdministratedPages = {
    name: 'getAdministratedPages',
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

        return controllerErrors('Error occurs when getting page administrated by the user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetAdministratedPages, logger).then(function (request) {
                logger.info('Request pages administrated by the user', req);
                return pageAdministrator.getAdministratedUserPages(req.user.id, request.skip, request.maxItems);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
