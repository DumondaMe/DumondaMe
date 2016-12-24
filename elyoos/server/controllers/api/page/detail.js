'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var auth = require('elyoos-server-lib').auth;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'label'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        label: {enum: ['Book', 'Youtube', 'Link', 'Blog', 'Generic']}
    }
};

var detail = {
    Book: requireModel('page/detail/bookDetail'),
    Youtube: requireModel('page/detail/videoDetail'),
    Link: requireModel('page/detail/linkDetail'),
    Blog: requireModel('page/detail/blogDetail'),
    Generic: requireModel('page/detail/genericDetail')
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting the page detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {

                var detailFunction = detail[request.label];
                if (detailFunction) {
                    logger.info("Getting detail information for page [" + request.pageId + "]", req);
                    return detailFunction.getDetail(request.pageId, request.label, req.user.id);
                }

                return exceptions.getInvalidOperation("Label [" + request.label + "] unknown", logger, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
