'use strict';

let auth = requireLib('auth');
let logger = requireLogger.getLogger(__filename);
let feedbackRating = requireModel('feedback/create/rating');
let controllerErrors = requireLib('error/controllerErrors');
let validation = requireLib('jsonValidation');

let schemaCreateRating = {
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

        return controllerErrors('Error occurs when rate a feedback element', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateRating, logger).then(function (request) {
                logger.info(`User rates a feedback element`, req);
                return feedbackRating.create(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
