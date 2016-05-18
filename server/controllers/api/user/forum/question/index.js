'use strict';
var auth = require('./../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var question = require('./../../../../../models/forum/question/question');
var controllerErrors = require('./../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../lib/jsonValidation');
var category = require("../../../../schema/category");
var language = require("../../../../schema/language");


var schemaAddQuestion = {
    name: 'createForumQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['description', 'category', 'language'],
    properties: {
        description: {type: 'string', format: 'notEmptyString', maxLength: 160},
        category: category.category,
        language: language.language
    }
};

var schemaDeleteQuestion= {
    name: 'deleteForumQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when creating a forum question', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddQuestion, logger).then(function (request) {
                logger.info("User created a new forum question", req);
                return question.createQuestion(req.user.id, request.description, request.category, request.language);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when deleting a forum question', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteQuestion, logger).then(function (request) {
                return question.deleteQuestion(req.user.id, request.questionId, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
