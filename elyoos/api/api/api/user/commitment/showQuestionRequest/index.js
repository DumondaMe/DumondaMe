'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const request = requireModel('user/commitment/showQuestionRequest');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaShowQuestionRequest = {
    name: 'showQuestionRequest',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'questionId', 'show'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        show: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.put('/:commitmentId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaShowQuestionRequest, logger);
        await request.showQuestion(req.user.id, params.commitmentId, params.questionId, params.show);
        res.status(200).end();
    }));
};