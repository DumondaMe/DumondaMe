'use strict';

var validation = require('./../../../lib/jsonValidation');
var page = require('./../../../models/page/page');
var auth = require('./../../../lib/auth');
var exceptions = require('./../../../lib/error/exceptions');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0, maximum: 50},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        filter: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 1000}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting the page overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                if (!request.search && !request.filter) {
                    logger.info('Request all pages without filter', req);
                    return page.getAllPages(req.user.id, request.skip, request.maxItems);
                }
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
