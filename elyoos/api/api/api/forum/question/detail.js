'use strict';
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let questionDetail = requireModel('forum/question/detail');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetDetailForumQuestion = {
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
                return questionDetail.getDetail(req.user.id, request.questionId);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
