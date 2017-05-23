'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let createNews = requireModel('news/create');
let editNews = requireModel('news/edit');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaCreateNews = {
    name: 'createNews',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'text'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        text: {type: 'string', format: 'notEmptyString', maxLength: 5000},
    }
};

let schemaEditNews = {
    name: 'editNews',
    type: 'object',
    additionalProperties: false,
    required: ['newsId', 'title', 'text'],
    properties: {
        newsId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        text: {type: 'string', format: 'notEmptyString', maxLength: 5000},
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when creating news', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateNews, logger).then(function (request) {
                logger.info(`Admin creates news`, req);
                return createNews.create(request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.put('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when edit news', req, res, logger, function () {
            return validation.validateRequest(req, schemaEditNews, logger).then(function (request) {
                logger.info(`Admin edits news`, req);
                return editNews.edit(request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
