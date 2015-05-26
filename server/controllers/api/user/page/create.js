'use strict';

var validation = require('./../../../../lib/jsonValidation');
var schema = require('./schemaCreateEdit');
var underscore = require('underscore');
var createBookPage = require('./../../../../models/user/page/createBookPage');
var createVideoPage = require('./../../../../models/user/page/createVideoPage');
var auth = require('./../../../../lib/auth');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schema, logger).then(function (request) {
                var filePath;
                if (req.files && req.files.file) {
                    filePath = req.files.file.path;
                }
                if (request.bookPage) {
                    underscore.defaults(request.bookPage, {publishDate: null});
                    return createBookPage.createBookPage(req.user.id, request.bookPage, filePath, req);
                } else if(request.videoPage) {
                    return createVideoPage.createVideoPage(req.user.id, request.videoPage);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
