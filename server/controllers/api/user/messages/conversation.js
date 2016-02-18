'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var conversation = require('./../../../../models/messages/conversation');
var messageThread = require('./../../../../models/messages/messageThread');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');

var schemaRequestGetMessages = {
    name: 'getConversationMessages',
    type: 'object',
    additionalProperties: false,
    required: ['maxItems', 'skip', 'threadId', 'isGroupThread'],
    properties: {
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0},
        threadId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        isGroupThread: {type: 'boolean'}
    }
};

var schemaRequestAddMessages = {
    name: 'addConversationMessages',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        addMessage: {
            type: 'object',
            additionalProperties: false,
            required: ['threadId', 'text'],
            properties: {
                threadId: {'$ref': '#/definitions/id'},
                text: {'$ref': '#/definitions/text'}
            }
        },
        addGroupMessage: {
            type: 'object',
            additionalProperties: false,
            required: ['threadId', 'text'],
            properties: {
                threadId: {'$ref': '#/definitions/id'},
                text: {'$ref': '#/definitions/text'}
            }
        },
        newSingleThread: {
            type: 'object',
            additionalProperties: false,
            required: ['contactId', 'text'],
            properties: {
                contactId: {'$ref': '#/definitions/id'},
                text: {'$ref': '#/definitions/text'}
            }
        },
        newGroupThread: {
            type: 'object',
            additionalProperties: false,
            required: ['contactIds', 'text'],
            properties: {
                contactIds: {'$ref': '#/definitions/ids'},
                text: {'$ref': '#/definitions/text'}
            }
        }
    },
    definitions: {
        ids: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 50},
            minItems: 1,
            maxItems: 1000,
            uniqueItems: true
        },
        id: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50},
        text: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 1000}
    }
};

module.exports = function (router) {


    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting user messages failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetMessages, logger)
                .then(function (request) {
                    logger.info("User requests thread " + request.threadId + " [skip] " + request.skip, req);
                    return conversation.getMessages(req.user.id, request.threadId, request.maxItems, request.skip,
                        request.isGroupThread, req.session, req);
                }).then(function (threads) {
                    res.status(200).json(threads);
                });
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Adding a new message has failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestAddMessages, logger).then(function (request) {
                if (request.addMessage) {
                    logger.info("User add a message to single thread " + request.addMessage.threadId, req);
                    return conversation.addMessage(req.user.id, request.addMessage.threadId,
                        request.addMessage.text, false, req.session, req);
                }
                if (request.addGroupMessage) {
                    logger.info("User add a message to group thread " + request.addGroupMessage.threadId, req);
                    return conversation.addMessage(req.user.id, request.addGroupMessage.threadId,
                        request.addGroupMessage.text, true, req.session, req);
                }
                if (request.newSingleThread) {
                    logger.info("User create a new single thread for communication with user " +
                    request.newSingleThread.contactId, req);
                    return messageThread.createSingleThread(req.user.id, request.newSingleThread.contactId,
                        request.newSingleThread.text, req.session, req);
                }
            }).then(function (resp) {
                res.status(200).json(resp);
            });
        });
    });
};
