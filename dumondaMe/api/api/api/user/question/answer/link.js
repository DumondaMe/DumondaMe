'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/link');
const answerEdit = requireModel('user/question/answer/edit/link');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaCreateLinkAnswer = {
    name: 'createLinkAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'link', 'title', 'type'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        link: {type: 'string', format: 'urlWithProtocol', maxLength: 2000},
        imageUrl: {type: 'string', format: 'urlWithProtocol', maxLength: 2000},
        title: {type: 'string', format: 'notEmptyString', maxLength: 140},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        type: {enum: ['article', 'blog', 'website']}
    }
};

const schemaEditLinkAnswer = {
    name: 'editLinkAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'title', 'type'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        title: {type: 'string', format: 'notEmptyString', maxLength: 140},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        type: {enum: ['article', 'blog', 'website']}
    }
};

module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateLinkAnswer, logger);
        params.description = params.description || null;
        let response = await answerCreate.createLinkAnswer(req.user.id, params);
        res.status(200).json(response);
    }));

    router.put('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditLinkAnswer, logger);
        params.description = params.description || null;
        let response = await answerEdit.editLinkAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
