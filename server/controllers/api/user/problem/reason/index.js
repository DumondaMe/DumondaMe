'use strict';
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var reason = require('./../../../../../models/problem/reason/reason');
var controllerErrors = require('./../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../lib/jsonValidation');
var _ = require("underscore");

var schemaRequestGetReasons = {
    name: 'getReasons',
    type: 'object',
    additionalProperties: false,
    required: ['problemId', 'maxItems', 'skip'],
    properties: {
        problemId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

var schemaReason = {
    name: 'reasonCommands',
    type: 'object',
    additionalProperties: false,
    properties: {
        createReason: {
            type: 'object',
            additionalProperties: false,
            required: ['problemId', 'title', 'description'],
            properties: {
                problemId: {type: 'string', format: 'notEmptyString', maxLength: 30},
                title: {type: 'string', format: 'notEmptyString', maxLength: 160},
                description: {type: 'string', format: 'notEmptyString', maxLength: 1000}
            }
        },
        positiveRate: {
            type: 'object',
            additionalProperties: false,
            required: ['reasonId'],
            properties: {
                reasonId: {type: 'string', format: 'notEmptyString', maxLength: 30}
            }
        },
        removePositiveRate: {
            type: 'object',
            additionalProperties: false,
            required: ['reasonId'],
            properties: {
                reasonId: {type: 'string', format: 'notEmptyString', maxLength: 30}
            }
        },
        addPage: {
            type: 'object',
            additionalProperties: false,
            required: ['reasonId', 'pageId'],
            properties: {
                reasonId: {type: 'string', format: 'notEmptyString', maxLength: 30},
                pageId: {type: 'string', format: 'notEmptyString', maxLength: 30}
            }
        }
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting seasons for problem failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetReasons, logger)
                .then(function (request) {
                    logger.info("User requests reasons for problem", req);
                    return reason.getReasons(req.user.id, request.problemId, request.maxItems, request.skip);
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

        return controllerErrors('Error occurs for post request reason for a problem', req, res, logger, function () {
            return validation.validateRequest(req, schemaReason, logger).then(function (request) {
                logger.info("User created a problem reason", req);
                if (request.hasOwnProperty('createReason')) {
                    return reason.createReason(req.user.id, request.createReason.problemId, request.createReason.title,
                        request.createReason.description);
                } else if (request.hasOwnProperty('positiveRate')) {
                    return reason.positiveRateReason(req.user.id, request.positiveRate.reasonId, req);
                } else if (request.hasOwnProperty('removePositiveRate')) {
                    return reason.removeRatingReason(req.user.id, request.removePositiveRate.reasonId, req);
                } else if (request.hasOwnProperty('addPage')) {
                    return reason.addPage(req.user.id, request.addPage.reasonId, request.addPage.pageId, req);
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
