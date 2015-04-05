'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var conversation = require('./../../../../models/messages/conversation');
var messageThread = require('./../../../../models/messages/messageThread');
var exceptions = require('./../../../../lib/error/exceptions');
var validation = require('./../../../../lib/jsonValidation');

var schemaRequestGetMessages = {
    name: 'getConversationMessages',
    type: 'object',
    additionalProperties: false,
    required: ['itemsPerPage', 'skip', 'threadId', 'isGroupThread'],
    properties: {
        itemsPerPage: {type: 'integer', minimum: 1, maximum: 50},
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

        return validation.validateQueryRequest(req, schemaRequestGetMessages, logger)
            .then(function (request) {
                return conversation.getMessages(req.user.id, request.threadId, request.itemsPerPage, request.skip, request.isGroupThread, req.session);
            }).then(function (threads) {
                res.status(200).json(threads);
            }).catch(exceptions.InvalidJsonRequest, function () {
                res.status(400).end();
            }).catch(exceptions.invalidOperation, function () {
                res.status(400).end();
            }).catch(function (err) {
                logger.error('Getting user messages failed', {error: err}, req);
                res.status(500).end();
            });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return validation.validateRequest(req, schemaRequestAddMessages, logger).then(function (request) {
            if (request.addMessage) {
                return conversation.addMessage(req.user.id, request.addMessage.threadId,
                    request.addMessage.text, false, req.session);
            }
            if (request.addGroupMessage) {
                return conversation.addMessage(req.user.id, request.addGroupMessage.threadId,
                    request.addGroupMessage.text, true, req.session);
            }
            if (request.newSingleThread) {
                return messageThread.createSingleThread(req.user.id, request.newSingleThread.contactId,
                    request.newSingleThread.text, req.session);
            }
        }).then(function (resp) {
            res.status(200).json(resp);
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(exceptions.invalidOperation, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Adding a new message has failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
