'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const admin = requireModel('user/commitment/admin');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;


const schemaGetAdminsOfCommtiment = {
    name: 'getAdminsOfCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

const schemaCommandCommitmentAdmin = {
    name: 'commandCommitmentAdmin',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'userId'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        userId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetAdminsOfCommtiment);
        let response = await admin.getAdmins(req.user.id, params.commitmentId);
        res.status(200).json(response);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCommandCommitmentAdmin);
        await admin.add(req.user.id, params.userId, params.commitmentId);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCommandCommitmentAdmin);
        await admin.remove(req.user.id, params.userId, params.commitmentId);
        res.status(200).end();
    }));
};
