'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var auth = require('elyoos-server-lib').auth;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var comments = requireModel('page/review/comments');
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
