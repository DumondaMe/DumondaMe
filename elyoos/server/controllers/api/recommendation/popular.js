'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var popularRecommendation = requireModel('recommendation/popular');
var auth = require('elyoos-server-lib').auth;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var language = require("../../schema/language");
var topic = require("../../schema/topic");
var recommendationType = require("../../schema/recommendationType");
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
