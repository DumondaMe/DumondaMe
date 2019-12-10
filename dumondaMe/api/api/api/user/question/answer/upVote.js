'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const upVote = requireModel('user/question/answer/upVote');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaUpVote = {
    name: 'upVote',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};


module.exports = function (router) {

    router.post('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaUpVote);
        let response = await upVote.upVote(req.user.id, params.answerId);
        res.status(200).json(response);
    }));

    router.delete('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaUpVote);
        await upVote.deleteUpVote(req.user.id, params.answerId);
        res.status(200).end();
    }));
};
