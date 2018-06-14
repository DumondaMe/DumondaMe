'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const commitment = requireModel('user/profile/commitment');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRequestGetCommitment = {
    name: 'getProfileCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems', 'isWatching'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        isWatching: {type: 'boolean'}
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestGetCommitment, logger);
        logger.info(`Requests people who trust user ${request.userId}`, req);
        let contacts = await commitment.getCommitment(req.user.id, request.userId,
            request.maxItems, request.skip, request.isWatching, req);
        res.status(200).json(contacts);
    }));
};
