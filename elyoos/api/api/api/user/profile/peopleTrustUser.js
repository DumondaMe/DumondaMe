'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const peopleTrustUser = requireModel('user/profile/peopleTrustUser');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRequestGetPeopleTrustUser = {
    name: 'getPeopleTrustUser',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestGetPeopleTrustUser, logger);
        logger.info(`Requests people who trust user ${request.userId}`, req);
        let contacts = await peopleTrustUser.getPeopleTrustUser(req.user.id, request.userId,
            request.maxItems, request.skip, req);
        res.status(200).json(contacts);
    }));
};
