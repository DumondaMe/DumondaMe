'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const detail = requireModel('question/detail');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const apiHelper = require('elyoos-server-lib').apiHelper;
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

    router.get('/:questionId', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetQuestionDetail, logger);
        let userId = apiHelper.getUserId(req);
        let response = await detail.getQuestion(params.questionId, userId);
        res.status(200).json(response);
    }));
};
