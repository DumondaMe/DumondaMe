'use strict';
var auth = require('elyoos-server-lib').auth;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
var popularQuestions = requireModel('forum/question/popular');
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var validation = require('elyoos-server-lib').jsonValidation;

var schemaGetPopularForumQuestion = {
    name: 'getPopularForumQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['maxItems', 'skip'],
    properties: {
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting most popular questions', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPopularForumQuestion, logger).then(function (request) {
                logger.info("User requests most popular questions", req);
                return popularQuestions.getQuestions(req.user.id, request.maxItems, request.skip);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
