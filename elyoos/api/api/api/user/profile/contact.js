'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let userProfileContacts = requireModel('user/profile/contact');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaRequestGetUserDetailContacts = {
    name: 'getUserDetailContacts',
    type: 'object',
    additionalProperties: false,
    required: ['contactOfUserId', 'skip', 'maxItems'],
    properties: {
        contactOfUserId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let request = await validation.validateQueryRequest(req, schemaRequestGetUserDetailContacts, logger);
        logger.info(`User requests contacts of user ${request.userId}`, req);
        let contacts = await userProfileContacts.getContacts(req.user.id, request.contactOfUserId,
            request.maxItems, request.skip, req);
        res.status(200).json(contacts);
    }));
};
