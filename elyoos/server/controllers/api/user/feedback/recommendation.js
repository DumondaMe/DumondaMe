'use strict';

let auth = requireLib('auth');
let logger = requireLogger.getLogger(__filename);
let feedbackRecommendation = requireModel('feedback/create/recommendation');
let controllerErrors = requireLib('error/controllerErrors');
let validation = requireLib('jsonValidation');

let schemaCreateRecommendation = {
    name: 'createFeedbackComment',
    type: 'object',
    additionalProperties: false,
    required: ['feedbackId'],
    properties: {
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when recommend a feedback element', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateRecommendation, logger).then(function (request) {
                logger.info(`User recommends a feedback element`, req);
                return feedbackRecommendation.create(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
