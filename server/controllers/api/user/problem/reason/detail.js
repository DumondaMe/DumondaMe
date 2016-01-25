'use strict';
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var reasonDetail = require('./../../../../../models/problem/reason/detail');
var controllerErrors = require('./../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../lib/jsonValidation');
var _ = require("underscore");

var schemaRequestGetProblemReasonDetailDescription = {
    name: 'getProblemReasonDetailReport',
    type: 'object',
    additionalProperties: false,
    required: ['reasonId'],
    properties: {
        reasonId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Getting Problem Reason Detail failed', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetProblemReasonDetailDescription, logger)
                .then(function (request) {
                    logger.info("User requests a problem reason detail", req);
                    return reasonDetail.getDetail(req.user.id, request.reasonId);
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
