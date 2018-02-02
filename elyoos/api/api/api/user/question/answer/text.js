'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/text');
const answerEdit = requireModel('user/question/answer/edit/text');
const answerDelete = requireModel('user/question/answer/delete/text');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateTextAnswer = {
    name: 'createTextAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'answer'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        answer: {type: 'string', format: 'notEmptyString', maxLength: 500}
    }
};

const schemaEditTextAnswer = {
    name: 'editTextAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['textId', 'answer'],
    properties: {
        textId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        answer: {type: 'string', format: 'notEmptyString', maxLength: 500}
    }
};

const schemaDeleteTextAnswer = {
    name: 'deleteTextAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['textId'],
    properties: {
        textId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateTextAnswer, logger);
        let response = await answerCreate.createTextAnswer(req.user.id, params);
        res.status(200).json(response);
    }));

    router.put('/:textId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditTextAnswer, logger);
        await answerEdit.editTextAnswer(req.user.id, params);
        res.status(200).end();
    }));

    router.delete('/:textId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteTextAnswer, logger);
        await answerDelete.deleteTextAnswer(req.user.id, params.textId);
        res.status(200).end();
    }));
};
