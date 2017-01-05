'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'label'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        label: {enum: ['Book', 'Youtube', 'Link', 'Blog', 'Generic']}
    }
};

let detail = {
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

                let detailFunction = detail[request.label];
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
