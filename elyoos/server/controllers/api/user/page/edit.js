'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let exception = require('elyoos-server-lib').exceptions;
let schema = require('./schema/schemaEdit');
let underscore = require('underscore');
let editBookPage = requireModel('user/page/edit/bookPage');
let editVideoPage = requireModel('user/page/edit/videoPage');
let editLinkPage = requireModel('user/page/edit/linkPage');
let editGenericPage = requireModel('user/page/edit/genericPage');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when editing a page occurs', req, res, logger, function () {
            return validation.validateRequest(req, schema, logger).then(function (request) {
                let filePath;
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
                } else if (request.hasOwnProperty('genericPage')) {
                    return editGenericPage.editGenericPage(req.user.id, request.genericPage, filePath, req);
                }
                throw new exception.InvalidOperation(`Unknown mode: ${request.mode}`);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
