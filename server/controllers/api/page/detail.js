'use strict';

var validation = require('./../../../lib/jsonValidation');
var bookDetail = require('./../../../models/page/detail/bookDetail');
var videoDetail = require('./../../../models/page/detail/videoDetail');
var auth = require('./../../../lib/auth');
var exceptions = require('./../../../lib/error/exceptions');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'label'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        label: {enum: ['BookPage', 'VideoPage']}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting the page detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                if (request.label === 'BookPage') {
                    return bookDetail.getBookDetail(request.pageId, req.user.id);
                }
                if (request.label === 'VideoPage') {
                    return videoDetail.getVideoDetail(request.pageId, req.user.id);
                }
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
