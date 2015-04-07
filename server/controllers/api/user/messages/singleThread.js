'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var search = require('./../../../../models/messages/searchThread');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');

var schemaGetSingleThread = {
    name: 'getSingleThread',
    type: 'object',
    additionalProperties: false,
    required: ['userId'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {


    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Searching single thread failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetSingleThread, logger)
                .then(function (request) {
                    logger.info("User searches single threads to user " + request.userId, req);
                    return search.searchSingleThread(req.user.id, request.userId);
                }).then(function (thread) {
                    res.status(200).json(thread);
                });
        });
    });
};
