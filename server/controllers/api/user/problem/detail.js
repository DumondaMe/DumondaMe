'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var problem = require('./../../../../models/problem/problem');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');
var _ = require("underscore");

var schemaRequestGetProblemDetailDescription = {
    name: 'getProblemDetailReport',
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting Problem Description failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetProblemDetailDescription, logger)
                .then(function (request) {
                    logger.info("User requests a problem Description", req);
                    return problem.getProblem(req.user.id, request.id);
                }).then(function (problem) {
                    if(_.isObject(problem)) {
                        res.status(200).json(problem);
                    } else {
                        res.status(404).end();
                    }
                });
        });
    });
};
