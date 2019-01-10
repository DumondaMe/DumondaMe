'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const inviteUser = requireModel('user/question/invite');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaInviteUserToAnswerQuestion = {
    name: 'inviteUserToAnswerQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['userIds', 'questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        userIds: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 60},
            minItems: 1,
            maxItems: 30,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaInviteUserToAnswerQuestion);
        let response = await inviteUser.inviteRegisteredUserToAnswerQuestion(req.user.id, params.userIds,
            params.questionId);
        res.status(200).json(response);
    }));
};
