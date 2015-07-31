'use strict';

var validation = require('./../../../../lib/jsonValidation');
var auth = require('./../../../../lib/auth');
var exceptions = require('./../../../../lib/error/exceptions');
var blog = require('./../../../../models/user/blog/blog');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRequestBlog = {
    name: 'blogRequests',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        addBlog: {
            type: 'object',
            additionalProperties: false,
            required: ['text'],
            properties: {
                text: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 10000},
                visibility: {
                    type: 'array',
                    items: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                    minItems: 1,
                    maxItems: 10,
                    uniqueItems: true
                }
            }
        }
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when request blog is handled', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestBlog, logger).then(function (request) {
                if(request.hasOwnProperty('addBlog')) {
                    logger.info('User adds a new blog', req);
                    return blog.addBlog(req.user.id, request.addBlog, req);
                }
                return exceptions.getInvalidOperation("Unknown request type", logger, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
