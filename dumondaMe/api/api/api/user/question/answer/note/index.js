'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const createNote = requireModel('user/question/answer/note/create');
const editNote = requireModel('user/question/answer/note/edit');
const deleteNote = requireModel('user/question/answer/note/delete');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateNote = {
    name: 'createNote',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'text'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        text: {type: 'string', format: 'notEmptyString', maxLength: 240}
    }
};

const schemaEditNote = {
    name: 'editNote',
    type: 'object',
    additionalProperties: false,
    required: ['noteId', 'text'],
    properties: {
        noteId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        text: {type: 'string', format: 'notEmptyString', maxLength: 240}
    }
};

const schemaDeleteNote = {
    name: 'deleteNote',
    type: 'object',
    additionalProperties: false,
    required: ['noteId'],
    properties: {
        noteId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateNote, logger);
        let response = await createNote.createNote(req.user.id, params.answerId, params.text);
        res.status(200).json(response);
    }));

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditNote, logger);
        let response = await editNote.editNote(req.user.id, params.noteId, params.text);
        res.status(200).json(response);
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteNote, logger);
        await deleteNote.deleteNote(req.user.id, params.noteId);
        res.status(200).end();
    }));
};
