'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const personOfTrust = requireModel('user/trustCircle/personOfTrust');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaRequestPersonOfTrust = {
    name: 'personOfTrustHandling',
    type: 'object',
    additionalProperties: false,
    required: ['userId'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/:userId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestPersonOfTrust, logger);
        logger.info(`User has added ${request.userId} to trust circle`, req);
        let result = await personOfTrust.addPersonToTrustCircle(req.user.id, request.userId, req);
        res.status(200).json(result);
    }));

    router.delete('/:userId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestPersonOfTrust, logger);
        logger.info(`User removed ${request.userId} from trust circle`, req);
        await personOfTrust.removePersonFromTrustCircle(req.user.id, request.userId, req);
        res.status(200).end();
    }));
};
