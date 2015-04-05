'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var messageThread = require('./../../../../models/messages/messageThread');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');

var schemaRequestGetMessages = {
    name: 'getMessages',
    type: 'object',
    additionalProperties: false,
    required: ['itemsPerPage', 'skip'],
    properties: {
        itemsPerPage: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {


    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting user message threads failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetMessages, logger)
                .then(function (request) {
                    logger.info("User " + req.user.id + " requests thread overview");
                    return messageThread.getMessageThreads(req.user.id, request.itemsPerPage, request.skip);
                }).then(function (threads) {
                    res.status(200).json(threads);
                });
        });
    });
};
