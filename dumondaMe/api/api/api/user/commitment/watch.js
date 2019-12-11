'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const watch = requireModel('user/commitment/watch');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaWatchCommitment = {
    name: 'watchCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.put('/:commitmentId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWatchCommitment);
        let response = await watch.addWatch(req.user.id, params.commitmentId);
        res.status(200).json(response);
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWatchCommitment);
        await watch.removeWatch(req.user.id, params.commitmentId);
        res.status(200).end();
    }));
};
