'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const alreadySent = requireModel('user/question/invite/alreadySent');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaInvitationsAlreadySent = {
    name: 'invitationsAlreadySent',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaInvitationsAlreadySent);
        let response = await alreadySent.getInvitationsAlreadySent(req.user.id, params.questionId);
        res.status(200).json(response);
    }));
};
