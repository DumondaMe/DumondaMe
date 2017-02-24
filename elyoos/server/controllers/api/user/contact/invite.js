'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let invite = requireModel('eMailService/invitePerson');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaInviteFriends = {
    name: 'inviteFriends',
    type: 'object',
    additionalProperties: false,
    required: ['emails'],
    properties: {
        emails: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 1000/*,
            uniqueItems: true*/
        }
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when inviting friends', req, res, logger, function () {
            return validation.validateRequest(req, schemaInviteFriends, logger).then(function (request) {
                logger.info("User invites friends", req);
                return invite.sendInvitation(req.user.id, request.emails);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
