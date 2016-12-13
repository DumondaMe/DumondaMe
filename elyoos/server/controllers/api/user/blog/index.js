'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var auth = require('elyoos-server-lib').auth;
let exceptions = require('elyoos-server-lib').exceptions;
var addBlog = requireModel('user/blog/addBlog');
var removeBlog = requireModel('user/blog/removeBlog');
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var topic = require("../../../schema/topic");
var language = require("./../../../schema/language");
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var schemaRequestBlog = {
    name: 'blogRequests',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        addBlog: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'text', 'topic', 'language'],
            properties: {
                title: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 80},
                text: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 10000},
                visibility: {
                    type: 'array',
                    items: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                    minItems: 1,
                    maxItems: 10,
                    uniqueItems: true
                },
                topic: topic.topicMultiple,
                language: language.language
            }
        }
    }
};

var schemaDeleteBlog = {
    name: 'deleteBlog',
    type: 'object',
    additionalProperties: false,
    required: ['pageId'],
    properties: {
        pageId: {type: 'string', format: 'id', maxLength: 50}
    }
};

var getFilePath = function (req) {
    if (req.hasOwnProperty('files') && req.files.hasOwnProperty('file') && req.files.file.hasOwnProperty('path')) {
        return req.files.file.path;
    }
    return null;
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when request blog is handled', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestBlog, logger).then(function (request) {
                var path = getFilePath(req);
                if (request.hasOwnProperty('addBlog')) {
                    logger.info('User adds a new blog', req);
                    return addBlog.addBlog(req.user.id, request.addBlog, path, req);
                }
                return exceptions.getInvalidOperation("Unknown request type", logger, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a blog', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteBlog, logger).then(function (request) {
                return removeBlog.removeBlog(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
