'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var problem = require('./../../../../models/problem/problem');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');
var _ = require("underscore");

var schemaRequestGetProblemDescription = {
    name: 'getProblemReport',
    type: 'object',
    additionalProperties: false,
    required: ['maxItems', 'skip'],
    properties: {
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

var schemaAddProblem = {
    name: 'createProblem',
    type: 'object',
    additionalProperties: false,
    required: ['description'],
    properties: {
        description: {type: 'string', format: 'notEmptyString', maxLength: 160}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting Problem Descriptions failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetProblemDescription, logger)
                .then(function (request) {
                    logger.info("User requests problem Descriptions", req);
                    return problem.getProblems(req.user.id, request.maxItems, request.skip);
                }).then(function (problem) {
                    if (_.isObject(problem)) {
                        res.status(200).json(problem);
                    } else {
                        res.status(404).end();
                    }
                });
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when creating a Problem', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddProblem, logger).then(function (request) {
                logger.info("User created a problem Description", req);
                return problem.createProblem(req.user.id, request.description);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
