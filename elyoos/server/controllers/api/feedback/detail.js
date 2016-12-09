'use strict';

var auth = requireLib('auth');
var logger = requireLogger.getLogger(__filename);
var feedbackDetail = requireModel('feedback/detail');
var controllerErrors = requireLib('error/controllerErrors');
var validation = requireLib('jsonValidation');

var schemaGetDetail = {
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
                return feedbackDetail.getDetail(req.user.id, request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
