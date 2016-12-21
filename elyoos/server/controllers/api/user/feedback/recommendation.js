'use strict';

let auth = require('elyoos-server-lib').auth;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
let feedbackRecommendation = requireModel('feedback/create/recommendation');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

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
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });
};
