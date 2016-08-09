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
    required: ['pageId'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        comment: {type: 'string', format: 'notEmptyString', maxLength: 1000}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs adding a blog recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddBlogRecommendation, logger).then(function (request) {
                return blogRecommendation.addRecommendation(req.user.id, request.pageId, request.comment, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });
};
