'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const block = requireModel('user/otherUser/block');
const auth = require('elyoos-server-lib').auth;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaBlockOtherUser = {
    name: 'blockOtherUser',
    type: 'object',
    additionalProperties: false,
    required: ['userId'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/:userId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaBlockOtherUser, logger);
        logger.info(`User has blocked ${request.userId}`, req);
        await block.blockOtherUser(req.user.id, request.userId, req);
        res.status(200).end();
    }));

    router.delete('/:userId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaBlockOtherUser, logger);
        logger.info(`User removed blocking of ${request.userId}`, req);
        await block.unblockOtherUser(req.user.id, request.userId, req);
        res.status(200).end();
    }));
};
