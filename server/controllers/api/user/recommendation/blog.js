'use strict';

var validation = require('./../../../../lib/jsonValidation');
var blogRecommendation = require('./../../../../models/recommendation/blog');
var auth = require('./../../../../lib/auth');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaAddBlogRecommendation = {
    name: 'addBlogRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['blogId'],
    properties: {
        blogId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

var schemaDeleteBlogRecommendation = {
    name: 'deleteBlogRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['recommendationId', 'blogId'],
    properties: {
        recommendationId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        blogId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs adding a blog recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddBlogRecommendation, logger).then(function (request) {
                return blogRecommendation.addRecommendation(req.user.id, request.blogId, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a user blog recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteBlogRecommendation, logger).then(function (request) {
                return blogRecommendation.deleteRecommendation(req.user.id, request.recommendationId, request.blogId, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });
};
