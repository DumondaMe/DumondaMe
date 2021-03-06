'use strict';

const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const overview = requireModel('news/overview');
const createNews = requireModel('news/create');
const editNews = requireModel('news/edit');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;

const schemaGetNewsOverview = {
    name: 'getNewsOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

const schemaCreateNews = {
    name: 'createNews',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'text'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        text: {type: 'string', format: 'notEmptyString', maxLength: 10000},
    }
};

const schemaEditNews = {
    name: 'editNews',
    type: 'object',
    additionalProperties: false,
    required: ['newsId', 'title', 'text'],
    properties: {
        newsId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        text: {type: 'string', format: 'notEmptyString', maxLength: 10000},
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetNewsOverview);
        logger.info("User requests news overview", req);
        const response = await overview.getOverview(params);
        res.status(200).json(response);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateNews, true);
        logger.info(`Admin creates news`, req);
        let response = await createNews.create(params);
        res.status(200).json(response);
    }));

    router.put('/:newsId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditNews, true);
        logger.info(`Admin edits news`, req);
        let response = await editNews.edit(params);
        res.status(200).json(response);
    }));
};
