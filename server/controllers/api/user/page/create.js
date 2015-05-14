'use strict';

var validation = require('./../../../../lib/jsonValidation');
var createBookPage = require('./../../../../models/user/page/createBookPage');
var auth = require('./../../../../lib/auth');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRequestCreatePage = {
    name: 'createPage',
    type: 'object',
    additionalProperties: false,
    properties: {
        createBookPage: {
            type: 'object',
            additionalProperties: false,
            required: ['language', 'title', 'description', 'author', 'publishDate'],
            properties: {
                language: {'$ref': '#/definitions/language'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                author: {type: 'string', format: 'notEmptyString', maxLength: 100},
                publishDate: {type: 'integer'}
            }
        },
        createVideoPage: {
            type: 'object',
            additionalProperties: false,
            required: ['threadId', 'text'],
            properties: {
                language: {'$ref': '#/definitions/language'},
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'}
            }
        }
    },
    definitions: {
        language: {enum: ['de', 'en', 'fr', 'it', 'es']},
        title: {type: 'string', format: 'notEmptyString', maxLength: 255},
        description: {type: 'string', format: 'notEmptyString', maxLength: 10000}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schemaRequestCreatePage, logger).then(function (request) {
                var filePath;
                if (req.files && req.files.file) {
                    filePath = req.files.file.path;
                }
                if (request.createBookPage) {
                    return createBookPage.createBookPage(req.user.id, request.createBookPage, filePath, req);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

};
