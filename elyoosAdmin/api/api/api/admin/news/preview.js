'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let previewNews = requireModel('news/preview');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

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

    router.post('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when sending preview news', req, res, logger, function () {
            return validation.validateRequest(req, schemaPreviewNews, logger).then(function (request) {
                logger.info(`Admin sends preview of news`, req);
                return previewNews.preview(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
