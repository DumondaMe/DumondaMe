'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/text');
const answerEdit = requireModel('user/question/answer/edit/text');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaCreateTextAnswer = {
    name: 'createTextAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'answer'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        answer: {type: 'string', format: 'notEmptyString', maxLength: 10000},
        createAnswerWithLink: {type: 'boolean'}
    }
};

const schemaEditTextAnswer = {
    name: 'editTextAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'answer'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        answer: {type: 'string', format: 'notEmptyString', maxLength: 10000}
    }
};

module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateTextAnswer);
        let response = await answerCreate.createTextAnswer(req.user.id, params);
        if (response.answerId) {
            res.status(200).json(response);
        } else {
            res.status(406).json(response);
        }
    }));

    router.put('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditTextAnswer);
        let response = await answerEdit.editTextAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
