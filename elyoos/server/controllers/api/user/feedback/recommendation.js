'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let feedbackCreateRecommendation = requireModel('feedback/create/recommendation');
let feedbackDeleteRecommendation = requireModel('feedback/delete/recommendation');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaFeedbackRecommendation = {
    name: 'FeedbackCreateRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['feedbackId'],
    properties: {
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

let schemaDeleteFeedbackRecommendation = {
    name: 'FeedbackDeleteRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['recommendationId'],
    properties: {
        recommendationId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when recommend a feedback element', req, res, logger, function () {
            return validation.validateRequest(req, schemaFeedbackRecommendation, logger).then(function (request) {
                logger.info(`User recommends a feedback element`, req);
                return feedbackCreateRecommendation.create(req.user.id, request, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a feedback recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteFeedbackRecommendation, logger).then(function (request) {
                return feedbackDeleteRecommendation.delete(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
