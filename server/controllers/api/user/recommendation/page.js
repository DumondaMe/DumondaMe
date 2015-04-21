'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    pageRecommendation = require('./../../../../models/recommendation/page'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    controllerErrors = require('./../../../../lib/error/controllerErrors'),
    logger = requireLogger.getLogger(__filename);

var schemaAddPageRecommendation = {
    name: 'addPageRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['rating', 'comment', 'pageId', 'label'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        label: {enum: ['BookPage', 'VideoPage', 'CoursePage', 'SchoolPage', 'PracticePage', 'EventPage', 'BlogPage']},
        comment: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        rating: {type: 'integer', minimum: 1, maximum: 5}
    }
};

var schemaDeletePageRecommendation = {
    name: 'deletePageRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['recommendationId'],
    properties: {
        recommendationId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddPageRecommendation, logger).then(function (request) {
                return pageRecommendation.addRecommendation(req.user.id, request.pageId, request.label, request.comment, request.rating);
            }).then(function () {
                res.status(200).end();
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a user recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeletePageRecommendation, logger).then(function (request) {
                return pageRecommendation.deleteRecommendation(req.user.id, request.recommendationId, req);
            }).then(function (statistic) {
                res.status(200).json(statistic);
            });
        });
    });
};
