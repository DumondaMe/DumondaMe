'use strict';
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const emailNotifications = requireModel('user/setting/emailNotifications');
const validation = require('dumonda-me-server-lib').jsonValidation;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaEmailNotificationSettings = {
    name: 'changeEmailNotificationsSettings',
    type: 'object',
    additionalProperties: false,
    required: ['interval'],
    properties: {
        interval: {enum: ['never', 'hour', 'day', '3days', 'week']}
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaEmailNotificationSettings);
        logger.info(`User ${req.user.id} changes email notification settings`, req);
        await emailNotifications.changeSettings(req.user.id, request.interval);
        res.status(200).end();
    }));
};
