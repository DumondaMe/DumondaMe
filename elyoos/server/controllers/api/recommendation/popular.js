'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let popularRecommendation = requireModel('recommendation/popular');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let language = require("../../schema/language");
let topic = require("../../schema/topic");
let recommendationType = require("../../schema/recommendationType");
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetPopularRecommendations = {
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
