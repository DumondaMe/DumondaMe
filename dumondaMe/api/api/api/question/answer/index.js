'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../../schema/language');
const answers = requireModel('question/answers');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const apiHelper = require('dumonda-me-server-lib').apiHelper;

const schemaGetQuestionAnswers = {
    name: 'getQuestionAnswers',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'language', 'page'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        page: {type: 'integer'},
        language: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetQuestionAnswers);
        let userId = apiHelper.getUserId(req);
        let response = await answers.getAnswers(params.questionId, params.page, params.language, userId);
        res.status(200).json(response);
    }));
};
