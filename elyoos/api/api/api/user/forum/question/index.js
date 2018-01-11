'use strict';
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let question = requireModel('forum/question/question');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let topic = require("../../../../schema/topic");
let language = require("../../../../schema/language");


let schemaAddQuestion = {
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

let schemaDeleteQuestion= {
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
