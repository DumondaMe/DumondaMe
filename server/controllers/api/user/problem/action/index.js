'use strict';
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var action = require('./../../../../../models/problem/action');
var controllerErrors = require('./../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../lib/jsonValidation');
var _ = require("underscore");

var schemaRequestGetActions = {
    name: 'getActions',
    type: 'object',
    additionalProperties: false,
    required: ['problemId', 'limit', 'skip'],
    properties: {
        problemId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        limit: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

var schemaAction = {
    name: 'actionCommands',
    type: 'object',
    additionalProperties: false,
    properties: {
        createAction: {
            type: 'object',
            additionalProperties: false,
            required: ['problemId', 'title', 'description', 'type'],
            properties: {
                problemId: {type: 'string', format: 'notEmptyString', maxLength: 30},
                title: {type: 'string', format: 'notEmptyString', maxLength: 160},
                description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                type: {enum: ['userAction', 'generalAction']}
            }
        },
        implementAction: {
            type: 'object',
            additionalProperties: false,
            required: ['actionId'],
            properties: {
                actionId: {type: 'string', format: 'notEmptyString', maxLength: 30}
            }
        }
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting Action for Problem failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetActions, logger)
                .then(function (request) {
                    logger.info("User requests actions for Problem", req);
                    return action.getAction(req.user.id, request.problemId, request.limit, request.skip);
                }).then(function (action) {
                    if (_.isObject(action)) {
                        res.status(200).json(action);
                    } else {
                        res.status(404).end();
                    }
                });
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when creating a Action for a Problem', req, res, logger, function () {
            return validation.validateRequest(req, schemaAction, logger).then(function (request) {
                logger.info("User created a problem Action", req);
                if (request.hasOwnProperty('createAction')) {
                    return action.createAction(req.user.id, request.createAction.problemId, request.createAction.title,
                        request.createAction.description, request.createAction.type);
                }
            }).then(function (action) {
                if (_.isObject(action)) {
                    res.status(200).json(action);
                } else {
                    res.status(404).end();
                }
            });
        });
    });
};
