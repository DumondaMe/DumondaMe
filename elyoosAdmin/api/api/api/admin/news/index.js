'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const createNews = requireModel('news/create');
const editNews = requireModel('news/edit');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;

const schemaCreateNews = {
    name: 'createNews',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'text'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        text: {type: 'string', format: 'notEmptyString', maxLength: 5000},
    }
};

const schemaEditNews = {
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

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateNews, logger);
        logger.info(`Admin creates news`, req);
        let response = await createNews.create(params);
        res.status(200).json(response);
    }));

    router.put('/:newsId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditNews, logger);
        logger.info(`Admin edits news`, req);
        let response = await editNews.edit(params);
        res.status(200).json(response);
    }));
};
