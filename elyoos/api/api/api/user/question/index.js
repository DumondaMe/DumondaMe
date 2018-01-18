'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const topic = require("../../../schema/topic");
const language = require("../../../schema/language");
const questionCreate = requireModel('user/question/create');
const questionEdit = requireModel('user/question/edit');
const questionDelete = requireModel('user/question/delete');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateQuestion = {
    name: 'createQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['question', 'topic', 'lang'],
    properties: {
        question: {type: 'string', format: 'notEmptyString', maxLength: 80},
        description: {type: 'string', format: 'notEmptyString', maxLength: 80},
        topic: topic.topicMultiple,
        lang: language.language
    }
};

const schemaEditQuestion = {
    name: 'editQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'question', 'topic'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        question: {type: 'string', format: 'notEmptyString', maxLength: 80},
        description: {type: 'string', format: 'notEmptyString', maxLength: 80},
        topic: topic.topicMultiple,
    }
};

const schemaDeleteContact = {
    name: 'deleteContact',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateQuestion, logger);
        let response = await questionCreate.createQuestion(req.user.id, params);
        res.status(200).json(response);
    }));

    router.put('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditQuestion, logger);
        await questionEdit.editQuestion(req.user.id, params);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteContact, logger);
        let response = await questionDelete.deleteQuestion(req.user.id, params.questionId);
        res.status(200).json(response);
    }));
};
