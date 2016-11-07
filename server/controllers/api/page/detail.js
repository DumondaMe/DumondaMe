'use strict';

var validation = require('./../../../lib/jsonValidation');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'label'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        label: {enum: ['Book', 'Youtube', 'Link', 'Blog', 'Place']}
    }
};

var detail = {
    Book: require('./../../../models/page/detail/bookDetail'),
    Youtube: require('./../../../models/page/detail/videoDetail'),
    Link: require('./../../../models/page/detail/linkDetail'),
    Blog: require('./../../../models/page/detail/blogDetail'),
    Place: require('./../../../models/page/detail/placeDetail')
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
