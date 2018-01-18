'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const detail = requireModel('question/detail');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetQuestionDetail = {
    name: 'getQuestionDetail',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetQuestionDetail, logger);
        let response = await detail.getQuestion(req.user.id, params.questionId);
        res.status(200).json(response);
    }));
};
