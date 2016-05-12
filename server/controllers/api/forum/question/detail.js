'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var questionDetail = require('./../../../../models/forum/question/detail');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');

var schemaGetDetailForumQuestion = {
    name: 'getForumQuestionDetail',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting question detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetDetailForumQuestion, logger).then(function (request) {
                logger.info("User gets question detail", req);
                return questionDetail.getDetail(request.questionId);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
