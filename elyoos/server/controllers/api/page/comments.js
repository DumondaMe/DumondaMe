'use strict';

var validation = requireLib('jsonValidation');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var comments = requireModel('page/review/comments');
var logger = requireLogger.getLogger(__filename);

var schemaGetPageComments = {
    name: 'getPageComments',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'skip', 'onlyContacts', 'maxItems'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        onlyContacts: {type: 'boolean'},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting a page comments', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPageComments, logger).then(function (request) {
                logger.info('Request page comments', req);
                return comments.getComments(req.user.id, request);
            }).then(function (pageReview) {
                res.status(200).json(pageReview);
            });
        });
    });
};
