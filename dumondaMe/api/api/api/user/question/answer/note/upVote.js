'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const upVoteNote = requireModel('user/question/answer/note/upVote');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaUpVoteNote = {
    name: 'upVoteNote',
    type: 'object',
    additionalProperties: false,
    required: ['noteId'],
    properties: {
        noteId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaUpVoteNote);
        await upVoteNote.upVote(req.user.id, params.noteId);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaUpVoteNote);
        let response = await upVoteNote.deleteUpVote(req.user.id, params.noteId);
        res.status(200).json(response);
    }));
};
