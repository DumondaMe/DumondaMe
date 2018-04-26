'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const notification = requireModel('user/notification/read');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaNotificationRead = {
    name: 'markNotificationAsRead',
    type: 'object',
    additionalProperties: false,
    required: ['notificationId'],
    properties: {
        notificationId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {
    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaNotificationRead, logger);
        let response = await notification.remove(req.user.id, params.notificationId);
        res.status(200).json(response);
    }));
};
