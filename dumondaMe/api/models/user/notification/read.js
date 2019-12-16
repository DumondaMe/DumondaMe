'use strict';

const db = requireDb();
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const markAsRead = async function (userId) {
    await db.cypher()
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification:Unread)`)
        .remove(`n:Unread`)
        .end({userId}).send();
    logger.info(`User ${userId} set notifications to read`);
};

module.exports = {
    markAsRead
};
