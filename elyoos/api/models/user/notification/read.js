'use strict';

const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const exceptions = require('elyoos-server-lib').exceptions;

const isOwnerOfNotification = async function (userId, notificationId) {
    let result = await db.cypher()
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification {notificationId: {notificationId}})`)
        .return(`n`).end({userId, notificationId}).send();
    if (result.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not owner of notification ${notificationId}`);
    }
};

const remove = async function (userId, notificationId) {
    await isOwnerOfNotification(userId, notificationId);
    await db.cypher()
        .match(`(:User {userId: {userId}})<-[rel1:NOTIFIED]-(n:Notification {notificationId: {notificationId}})`)
        .optionalMatch(`(n)-[rel2:NOTIFICATION]->()`)
        .optionalMatch(`(n)-[rel3:ORIGINATOR_OF_NOTIFICATION]->(:User)`)
        .delete(`rel1, rel2, rel3, n`)
        .end({userId, notificationId}).send();
    logger.info(`User ${userId} has notification ${notificationId} read`);
};

module.exports = {
    remove
};
