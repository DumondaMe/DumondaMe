'use strict';

var validation = requireLib('jsonValidation');
var popularRecommendation = requireModel('recommendation/popular');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var language = require("../../schema/language");
var topic = require("../../schema/topic");
var recommendationType = require("../../schema/recommendationType");
var logger = requireLogger.getLogger(__filename);

var schemaGetPopularRecommendations = {
    name: 'getPopularRecommendations',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'onlyContact', 'period'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        onlyContact: {type: 'boolean'},
        period: {enum: ['all', 'twoWeeks']},
        language: language.languageMultiple,
        topic: topic.topicMultiple,
        recommendationType: recommendationType.typeMultiple
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when requesting popular recommendations', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPopularRecommendations, logger).then(function (request) {
                logger.info('Request popular recommendations', req);
                return popularRecommendation.getPopularRecommendations(req.user.id, request);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
