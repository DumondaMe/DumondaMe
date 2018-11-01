'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const notes = requireModel('question/answer/note');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const apiHelper = require('dumonda-me-server-lib').apiHelper;

const schemaGetNotesOfAnswer = {
    name: 'getNotesOfAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'page', 'sort'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        page: {type: 'integer', minimum: 0},
        sort: {enum: ['newest', 'upVotes']}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetNotesOfAnswer);
        let userId = apiHelper.getUserId(req);
        let response = await notes.getNotes(userId, params.answerId, params.page, params.sort);
        res.status(200).json(response);
    }));
};
