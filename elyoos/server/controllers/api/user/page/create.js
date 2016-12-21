'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var schema = require('./schema/schemaCreate');
var underscore = require('underscore');
var createBookPage = requireModel('user/page/createBookPage');
var createVideoPage = requireModel('user/page/createVideoPage');
var createLinkPage = requireModel('user/page/createLinkPage');
var createPlacePage = requireModel('user/page/createPlacePage');
var auth = require('elyoos-server-lib').auth;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schema, logger).then(function (request) {
                var filePath;
                if (req.files && req.files.file) {
                    filePath = req.files.file.path;
                }
                if (request.hasOwnProperty('bookPage')) {
                    underscore.defaults(request.bookPage, {publishDate: null});
                    return createBookPage.createBookPage(req.user.id, request.bookPage, filePath, req);
                } else if(request.youtubePage) {
                    return createVideoPage.createVideoPage(req.user.id, request.youtubePage);
                } else if(request.linkPage) {
                    return createLinkPage.createLinkPage(req.user.id, request.linkPage, filePath, req);
                } else if(request.placePage) {
                    return createPlacePage.createPlacePage(req.user.id, request.placePage, filePath, req);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
