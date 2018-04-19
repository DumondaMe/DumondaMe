'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const watch = requireModel('user/commitment/watch');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaWatchCommitment = {
    name: 'watchCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.put('/:commitmentId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWatchCommitment, logger);
        await watch.addWatch(req.user.id, params.commitmentId);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWatchCommitment, logger);
        await watch.removeWatch(req.user.id, params.commitmentId);
        res.status(200).end();
    }));
};
