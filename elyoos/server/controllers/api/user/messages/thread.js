'use strict';
var auth = requireLib('auth');
var logger = requireLogger.getLogger(__filename);
var messageThread = requireModel('messages/messageThread');
var controllerErrors = requireLib('error/controllerErrors');
var validation = requireLib('jsonValidation');

var schemaRequestGetMessages = {
    name: 'getMessages',
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

        return controllerErrors('Getting user message threads failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetMessages, logger)
                .then(function (request) {
                    logger.info("User requests thread overview", req);
                    return messageThread.getMessageThreads(req.user.id, request.maxItems, request.skip);
                }).then(function (threads) {
                    res.status(200).json(threads);
                });
        });
    });
};
