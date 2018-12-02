'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const notification = requireModel('user/notification/notification');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaGetNotifications = {
    name: 'getNotifications',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'limit'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        limit: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let params = await validation.validateRequest(req, schemaGetNotifications);
        let response = await notification.getNotifications(req.user.id, params.skip, params.limit);
        res.status(200).json(response);
    }));
};
