'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const createNote = requireModel('user/question/answer/note/create');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaNote = {
    name: 'handlingNote',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'text'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        text: {type: 'string', format: 'notEmptyString', maxLength: 240}
    }
};

const schemaDeleteNote = {
    name: 'deleteNote',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaNote, logger);
        let response = await createNote.createNote(req.user.id, params.answerId, params.text);
        res.status(200).json(response);
    }));

    router.put('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        /*const params = await validation.validateRequest(req, schemaNote, logger);
        await questionEdit.editQuestion(req.user.id, params);
        res.status(200).end();*/
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        /*const params = await validation.validateRequest(req, schemaDeleteNote, logger);
        let response = await questionDelete.deleteQuestion(req.user.id, params.questionId);
        res.status(200).json(response);*/
    }));
};
