'use strict';

var validation = require('./../../../../lib/jsonValidation');
var schema = require('./schemaCreateEdit');
var underscore = require('underscore');
var editBookPage = require('./../../../../models/user/page/editBookPage');
var editVideoPage = require('./../../../../models/user/page/editVideoPage');
var auth = require('./../../../../lib/auth');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

schema = JSON.parse(JSON.stringify(schema));
schema.properties.bookPage.required.push('pageId');
schema.properties.bookPage.properties.pageId = {'$ref': '#/definitions/id'};

schema.properties.videoPage.required.push('pageId');
schema.properties.videoPage.properties.pageId = {'$ref': '#/definitions/id'};
delete schema.properties.videoPage.properties.subCategory;
schema.properties.videoPage.required = underscore.without(schema.properties.videoPage.required, 'subCategory');

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when editing a page occurs', req, res, logger, function () {
            return validation.validateRequest(req, schema, logger).then(function (request) {
                var filePath;
                if (req.files && req.files.file) {
                    filePath = req.files.file.path;
                }
                if (request.bookPage) {
                    underscore.defaults(request.bookPage, {publishDate: null});
                    return editBookPage.editBookPage(req.user.id, request.bookPage, filePath, req);
                } else if (request.videoPage) {
                    return editVideoPage.editVideoPage(req.user.id, request.videoPage, req);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
