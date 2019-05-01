'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const admin = requireModel('user/commitment/admin');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaConfirmBeAdminOfCommitment = {
    name: 'confirmBeAdminOfCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['notificationId', 'confirmToBeAdmin'],
    properties: {
        notificationId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        confirmToBeAdmin: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaConfirmBeAdminOfCommitment);
        await admin.confirmToAddAdminToCommitment(req.user.id, params.notificationId, params.confirmToBeAdmin);
        res.status(200).end();
    }));
};
