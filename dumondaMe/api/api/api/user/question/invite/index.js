'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const inviteUser = requireModel('user/question/invite');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaInviteNotRegisteredUserToAnswerQuestion = {
    name: 'inviteNotRegisteredUserToAnswerQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['emails', 'questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        emails: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 30,
            uniqueItems: true
        }
    }
};

const lowerCaseEmails = function (emails) {
    if (emails) {
        for (let index = 0; index < emails.length; index++) {
            if (typeof emails[index] === 'string') {
                emails[index] = emails[index].toLowerCase();
            }
        }
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        lowerCaseEmails(req.body.emails);
        const params = await validation.validateRequest(req, schemaInviteNotRegisteredUserToAnswerQuestion);
        let response = await inviteUser.inviteNotRegisteredUserToAnswerQuestion(req.user.id, params.emails,
            params.questionId, req);
        res.status(200).json(response);
    }));
};
