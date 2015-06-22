'use strict';

var validation = require('./../../../lib/jsonValidation');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var review = require('./../../../models/page/review/review');
var logger = requireLogger.getLogger(__filename);

var schemaGetPageReview = {
    name: 'getPageReview',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'label', 'skip', 'onlyContacts', 'maxItems'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        label: {enum: ['BookPage', 'VideoPage']},
        skip: {type: 'integer', minimum: 0},
        onlyContacts: {type: 'boolean'},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting a page review', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPageReview, logger).then(function (request) {
                logger.info('Request page review', req);
                return review.getReview(req.user.id, request);
            }).then(function (pageReview) {
                res.status(200).json(pageReview);
            });
        });
    });
};
