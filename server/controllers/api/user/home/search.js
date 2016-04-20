'use strict';

var validation = require('./../../../../lib/jsonValidation');
var search = require('./../../../../models/search/search');
var auth = require('./../../../../lib/auth');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRequestSearchHome = {
    name: 'requestSearchHome',
    type: 'object',
    additionalProperties: false,
    required: ['search', 'maxItems'],
    properties: {
        search: {type: 'string', format: 'notEmptyString', maxLength: 300},
        maxItems: {type: 'integer', minimum: 1, maximum: 20}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when searching for a user, pages', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestSearchHome, logger).then(function (request) {
                logger.info("User searches user or page " + request.search, req);
                return search.search(req.user.id, request.search, request.maxItems);
            }).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
