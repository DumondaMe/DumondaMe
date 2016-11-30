'use strict';

var validation = requireLib('jsonValidation');
var schema = require('./schema/schemaEdit');
var underscore = require('underscore');
var editBookPage = requireModel('user/page/editBookPage');
var editVideoPage = requireModel('user/page/editVideoPage');
var editLinkPage = requireModel('user/page/editLinkPage');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when editing a page occurs', req, res, logger, function () {
            return validation.validateRequest(req, schema, logger).then(function (request) {
                var filePath;
                if (req.files && req.files.file) {
                    filePath = req.files.file.path;
                }
                if (request.hasOwnProperty('bookPage')) {
                    underscore.defaults(request.bookPage, {publishDate: null});
                    return editBookPage.editBookPage(req.user.id, request.bookPage, filePath, req);
                } else if (request.hasOwnProperty('youtubePage')) {
                    return editVideoPage.editVideoPage(req.user.id, request.youtubePage, req);
                } else if (request.hasOwnProperty('linkPage')) {
                    return editLinkPage.editLinkPage(req.user.id, request.linkPage, filePath, req);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
