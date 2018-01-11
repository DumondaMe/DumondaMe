'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let blogRecommendation = requireModel('recommendation/blog');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaAddBlogRecommendation = {
    name: 'addBlogRecommendation',
    type: 'object',
    additionalProperties: false,
    required: ['pageId'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs adding a blog recommendation', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddBlogRecommendation, logger).then(function (request) {
                return blogRecommendation.addRecommendation(req.user.id, request.pageId,req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });
};
