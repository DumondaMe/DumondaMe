'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var search = require('./../../../../models/messages/searchThread');
var exceptions = require('./../../../../../common/src/lib/error/exceptions');
var validation = require('./../../../../../common/src/lib/jsonValidation');

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

        return validation.validateQueryRequest(req, schemaGetSingleThread, logger)
            .then(function (request) {
                return search.searchSingleThread(req.user.id, request.userId);
            }).then(function (threads) {
                res.status(200).json(threads);
            }).catch(exceptions.InvalidJsonRequest, function () {
                res.status(400).end();
            }).catch(function (err) {
                logger.error('Searching single thread failed', {error: err}, req);
                res.status(500).end();
            });
    });
};
