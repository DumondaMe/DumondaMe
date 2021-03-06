'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../../../schema/language');
const answerCreate = requireModel('user/question/answer/create/commitment');
const answerEdit = requireModel('user/question/answer/edit/commitment');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaCreateCommitmentAnswer = {
    name: 'createCommitmentAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'questionId', 'description', 'language'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        description: {type: 'string', format: 'notEmptyString', maxLength: 2000},
        language: schemaLanguage.language
    }
};

const schemaEditCommitmentAnswer = {
    name: 'editCommitmentAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'description'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        description: {type: 'string', format: 'notEmptyString', maxLength: 2000}
    }
};

module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateCommitmentAnswer);
        let response = await answerCreate.createCommitmentAnswer(req.user.id, params);
        res.status(200).json(response);
    }));

    router.put('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditCommitmentAnswer);
        let response = await answerEdit.editCommitmentAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
