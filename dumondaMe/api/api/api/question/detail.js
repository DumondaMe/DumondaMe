'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const detail = requireModel('question/detail');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const apiHelper = require('dumonda-me-server-lib').apiHelper;

const schemaGetQuestionDetail = {
    name: 'getQuestionDetail',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'language'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        language: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/:questionId', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetQuestionDetail);
        let userId = apiHelper.getUserId(req);
        let superUser = apiHelper.isSuperUser(req);
        params.answerId = params.answerId || null;
        let response = await detail.getQuestion(params.questionId, params.answerId, params.language, userId, superUser);
        res.status(200).json(response);
    }));
};
