'use strict';
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let answerDetail = requireModel('forum/answer/detail');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetDetailForumAnswer = {
    name: 'getForumAnswerDetail',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting answer detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetDetailForumAnswer, logger).then(function (request) {
                logger.info("User gets answer detail", req);
                return answerDetail.getDetail(req.user.id, request.answerId);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
