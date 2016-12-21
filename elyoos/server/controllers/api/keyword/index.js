'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var auth = require('elyoos-server-lib').auth;
var keyword = requireModel('keyword/keyword');
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

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

        return controllerErrors('Error occurs when getting keywords', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetAdministratedPages, logger).then(function (request) {
                logger.info('Request Keywords', req);
                return keyword.getKeywords(request, req);
            }).then(function (keywords) {
                res.status(200).json(keywords);
            });
        });
    });
};
