'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const invite = requireModel('otherUser/invitePerson');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaInviteFriends = {
    name: 'inviteFriends',
    type: 'object',
    additionalProperties: false,
    required: ['emails'],
    properties: {
        emails: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 1000,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        if (Array.isArray(req.body.emails)) {
            req.body.emails = req.body.emails.map(email => email.toLowerCase());
        }
        let request = await validation.validateRequest(req, schemaInviteFriends);
        await invite.setInvitationFlag(req.user.id, request.emails);
        res.status(200).end();
    }));
};
