'use strict';

var validation = requireLib('jsonValidation');
var auth = requireLib('auth');
var pinwall = requireModel('user/pinwall/pinwall');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetAdministratedPages = {
    name: 'getHomeInfos',
    type: 'object',
    additionalProperties: false,
    required: ['skipBlog', 'skipRecommendation', 'maxItems'],
    properties: {
        skipBlog: {type: 'integer', minimum: 0},
        skipRecommendation: {type: 'integer', minimum: 0},
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
