'use strict';

var validation = require('./../../../lib/jsonValidation');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var blogDetail = require('./../../../models/blog/blogDetail');
var logger = requireLogger.getLogger(__filename);

var schemaGetBlogDetail = {
    name: 'getBlogDetail',
    type: 'object',
    additionalProperties: false,
    required: ['blogId'],
    properties: {
        blogId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting blog detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetBlogDetail, logger).then(function (request) {
                logger.info('Request blog detail', req);
                return blogDetail.getDetail(req.user.id, request.blogId);
            }).then(function (pageReview) {
                res.status(200).json(pageReview);
            });
        });
    });
};
