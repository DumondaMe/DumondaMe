'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let pageRecommendation = requireModel('recommendation/page');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaAddPageRecommendation = {
    name: 'addPageRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['pageId'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

let schemaDeletePageRecommendation = {
    name: 'deletePageRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['recommendationId', 'pageId'],
    properties: {
        recommendationId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddPageRecommendation, logger).then(function (request) {
                return pageRecommendation.addRecommendation(req.user.id, request.pageId, false, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a user recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeletePageRecommendation, logger).then(function (request) {
                return pageRecommendation.deleteRecommendation(req.user.id, request.recommendationId, request.pageId, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });
};
