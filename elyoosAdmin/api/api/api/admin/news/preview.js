'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const previewNews = requireModel('news/preview');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;

let schemaPreviewNews = {
    name: 'previewNews',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'text'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        text: {type: 'string', format: 'notEmptyString', maxLength: 5000},
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaPreviewNews, logger);
        logger.info(`Admin sends preview of news`, req);
        await previewNews.preview(req.user.id, params, req);
        res.status(200).end();
    }));
};
