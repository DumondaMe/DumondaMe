'use strict';
var auth = require('./../../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var answer = require('./../../../../../../models/forum/answer/answer');
var controllerErrors = require('./../../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../../lib/jsonValidation');

var schemaAddQuestionAnswer = {
    name: 'createForumAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'description', 'type'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        type: {enum: ['explanation', 'solution']}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when creating a forum answer', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddQuestionAnswer, logger).then(function (request) {
                logger.info("User created a new forum answer", req);
                return answer.createAnswer(req.user.id, request.questionId, request.description, request.type, request.pageId, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
