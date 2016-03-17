'use strict';

var validation = require('./../../../lib/jsonValidation');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var ratings = require('./../../../models/page/review/ratings');
var logger = requireLogger.getLogger(__filename);

var schemaGetPageRating = {
    name: 'getPageRating',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'onlyContacts'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        onlyContacts: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting a page ratings', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPageRating, logger).then(function (request) {
                logger.info('Request page ratings', req);
                return ratings.getRatings(req.user.id, request);
            }).then(function (pageReview) {
                res.status(200).json(pageReview);
            });
        });
    });
};
