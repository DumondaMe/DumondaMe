'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const deleteAnswer = requireModel('user/question/answer/delete');
const auth = require('dumonda-me-server-lib').auth;


const schemaDeleteAnswer = {
    name: 'deleteAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteAnswer);
        await deleteAnswer.deleteAnswer(req.user.id, params.answerId);
        res.status(200).end();
    }));
};
