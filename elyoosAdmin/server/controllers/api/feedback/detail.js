'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let feedbackDetail = requireModel('feedback/detail');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetDetail = {
    name: 'getFeedbackDetail',
    type: 'object',
    additionalProperties: false,
    required: ['feedbackId'],
    properties: {
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting feedback detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetDetail, logger).then(function (request) {
                logger.info("User requests feedback detail", req);
                return feedbackDetail.getDetail(req.user.id, request, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
