'use strict';

const db = requireDb();
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const exceptions = require('dumonda-me-server-lib').exceptions;

const ERROR_CODE_NOTIFICATION_NOT_EXISTING = 1;

const isAllowedToMarkNotificationAsRead = async function (userId, notificationId) {
    let result = await db.cypher()
        .match(`(n:Notification {notificationId: {notificationId}})`)
        .optionalMatch(`(user:User {userId: {userId}})<-[:NOTIFIED]-(n)`)
        .return(`n, user`).end({userId, notificationId}).send();
    if (result.length === 0) {
        throw new exceptions.InvalidOperation(`Notification ${notificationId} does not exist`,
            ERROR_CODE_NOTIFICATION_NOT_EXISTING);
    } else if (!result[0].user) {
        throw new exceptions.InvalidOperation(`User ${userId} is not owner of notification ${notificationId}`);
    }
};

const markAsRead = async function (userId, notificationId) {
    await isAllowedToMarkNotificationAsRead(userId, notificationId);
    await db.cypher()
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification {notificationId: {notificationId}})`)
        .remove(`n:Unread`)
        .end({userId, notificationId}).send();
    logger.info(`User ${userId} has notification ${notificationId} read`);
};

module.exports = {
    markAsRead
};
