'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let schema = require('./schema/schemaCreate');
let underscore = require('underscore');
let createBookPage = requireModel('user/page/createBookPage');
let createVideoPage = requireModel('user/page/createVideoPage');
let createLinkPage = requireModel('user/page/createLinkPage');
let createGenericPage = requireModel('user/page/createGenericPage');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schema, logger).then(function (request) {
                let filePath;
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
                } else if(request.genericPage) {
                    return createGenericPage.createGenericPage(req.user.id, request.genericPage, filePath, req);
                }
                logger.error('Unknown mode: ' + request.mode);
                res.status(500).end();
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
