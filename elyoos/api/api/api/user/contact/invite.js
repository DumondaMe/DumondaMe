'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const invite = requireModel('eMailService/invitePerson');
const auth = require('elyoos-server-lib').auth;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
        },
        message: {type: 'string', format: 'notEmptyString', maxLength: 300}
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        logger.info("User invites friends", req);
        let request = await validation.validateRequest(req, schemaInviteFriends, logger);
        await invite.sendInvitation(req.user.id, request.emails, request.message);
        res.status(200).end();
    }));
};
