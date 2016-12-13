'use strict';
var auth = require('elyoos-server-lib').auth;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
var question = requireModel('forum/question/question');
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var validation = require('elyoos-server-lib').jsonValidation;
var topic = require("../../../../schema/topic");
var language = require("../../../../schema/language");


var schemaAddQuestion = {
    name: 'createForumQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['description', 'topic', 'language'],
    properties: {
        description: {type: 'string', format: 'notEmptyString', maxLength: 160},
        topic: topic.topicMultiple,
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
                return question.createQuestion(req.user.id, request.description, request.topic, request.language);
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
