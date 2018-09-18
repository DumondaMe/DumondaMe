'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const suggestionCreate = requireModel('superUser/question/suggestion/create');
const suggestionEdit = requireModel('superUser/question/suggestion/edit');
const suggestionDelete = requireModel('superUser/question/suggestion/delete');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaCreateSuggestion = {
    name: 'createSuggestion',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        title: {type: 'string', format: 'notEmptyString', maxLength: 140},
        description: {type: 'string', format: 'notEmptyString', maxLength: 2000},
        explanation: {type: 'string', format: 'notEmptyString', maxLength: 2000},
    }
};

const schemaEditSuggestion = {
    name: 'editSuggestion',
    type: 'object',
    additionalProperties: false,
    required: ['suggestionId'],
    properties: {
        suggestionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        title: {type: 'string', format: 'notEmptyString', maxLength: 140},
        description: {type: 'string', format: 'notEmptyString', maxLength: 2000},
        explanation: {type: 'string', format: 'notEmptyString', maxLength: 2000},
    }
};

const schemaDeleteSuggestion = {
    name: 'deleteSuggestion',
    type: 'object',
    additionalProperties: false,
    required: ['suggestionId'],
    properties: {
        suggestionId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

const checkParameter = function (title, description, explanation) {
    if (!title && !description && !explanation) {
        throw new exceptions.InvalidOperation(`At least one parameter need to be defined`);
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateSuggestion, logger);
        checkParameter(params.title, params.description, params.explanation);
        params.title = params.title || null;
        params.description = params.description || null;
        params.explanation = params.explanation || null;
        let response = await suggestionCreate.createSuggestion(req.user.id, params.questionId, params.title,
            params.description, params.explanation);
        res.status(200).json(response);
    }));

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditSuggestion, logger);
        checkParameter(params.title, params.description, params.explanation);
        params.title = params.title || null;
        params.description = params.description || null;
        params.explanation = params.explanation || null;
        await suggestionEdit.editSuggestion(req.user.id, params.suggestionId, params.title,
            params.description, params.explanation);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteSuggestion, logger);
        await suggestionDelete.deleteSuggestion(req.user.id, params.suggestionId);
        res.status(200).end();
    }));
};
