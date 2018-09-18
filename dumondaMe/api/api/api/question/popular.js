'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const popularQuestion = requireModel('question/popular');
const schemaLanguage = require("../../schema/language");
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaGetPopularQuestionDetail = {
    name: 'getPopularQuestionDetail',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language,
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetPopularQuestionDetail, logger);
        let response = await popularQuestion.getPopularQuestions(params.language);
        res.status(200).json(response);
    }));
};
