'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const request = requireModel('user/commitment/showQuestionRequest');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaShowQuestionRequest = {
    name: 'showQuestionRequest',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'questionId', 'showQuestion'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        showQuestion: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.put('/:commitmentId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaShowQuestionRequest, logger);
        let response = await request.showQuestion(req.user.id, params.commitmentId, params.questionId,
            params.showQuestion);
        res.status(200).json(response);
    }));
};
