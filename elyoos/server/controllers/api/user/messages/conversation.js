'use strict';
var auth = require('elyoos-server-lib').auth;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
var conversation = requireModel('messages/conversation');
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var validation = require('elyoos-server-lib').jsonValidation;

var schemaRequestGetMessages = {
    name: 'getConversationMessages',
    type: 'object',
    additionalProperties: false,
    required: ['maxItems', 'skip', 'threadId'],
    properties: {
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0},
        threadId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

var schemaRequestAddMessages = {
    name: 'addConversationMessages',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        addMessageThread: {
            type: 'object',
            additionalProperties: false,
            required: ['threadId', 'text'],
            properties: {
                threadId: {'$ref': '#/definitions/id'},
                text: {'$ref': '#/definitions/text'}
            }
        },
        addMessageUser: {
            type: 'object',
            additionalProperties: false,
            required: ['userId', 'text'],
            properties: {
                userId: {'$ref': '#/definitions/id'},
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
                    return conversation.getMessages(req.user.id, request.threadId, request.maxItems, request.skip, req.session, req);
                }).then(function (threads) {
                    res.status(200).json(threads);
                });
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Adding a new message has failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestAddMessages, logger).then(function (request) {
                if (request.hasOwnProperty('addMessageThread')) {
                    logger.info("User add a message to a thread " + request.addMessageThread.threadId, req);
                    return conversation.addMessageToThread(req.user.id, request.addMessageThread.threadId,
                        request.addMessageThread.text, req.session, req);
                }
                if (request.hasOwnProperty('addMessageUser')) {
                    logger.info("User sends a message to another user " + request.addMessageUser.userId, req);
                    return conversation.addMessageToUser(req.user.id, request.addMessageUser.userId,
                        request.addMessageUser.text, req.session, req);
                }
            }).then(function (resp) {
                res.status(200).json(resp);
            });
        });
    });
};
