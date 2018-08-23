'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const trustCircle = requireModel('user/profile/trustCircle');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRequestGetPeopleOfTrust = {
    name: 'getTrustCircle',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestGetPeopleOfTrust, logger);
        logger.info(`Requests trust circle of user ${request.userId}`, req);
        let contacts = await trustCircle.getTrustCircle(req.user.id, request.userId,
            request.maxItems, request.skip, req);
        res.status(200).json(contacts);
    }));
};
