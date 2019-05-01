'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;

const matchNotification = `(c:Commitment)<-[:NOTIFICATION]-(n:Notification {notificationId: {notificationId}, 
                 type: 'requestAdminOfCommitment'})-[:NOTIFIED]->(u:User {userId: {userId}})`;

const isNotificationOfUser = async function (userId, notificationId) {
    let response = await db.cypher()
        .match(matchNotification)
        .return(`n`)
        .end({userId, notificationId}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`Wrong notification ${notificationId} for user ${userId}`);
    }
};

const markNotificationAsRead = function (userId, notificationId, confirmToBeAdmin) {
    return db.cypher()
        .match(matchNotification)
        .set(`n`, {confirmToBeAdmin})
        .remove(`n:Unread`)
        .end({userId, notificationId});
};

const addNewAdminToCommitment = function (userId, notificationId) {
    return db.cypher()
        .match(matchNotification)
        .merge(`(u)-[:IS_ADMIN]->(c)`)
        .end({userId, notificationId}).getCommand();
};

const confirmToAddAdminToCommitment = async function (userId, notificationId, confirmToBeAdmin) {
    let commands = null;
    await isNotificationOfUser(userId, notificationId);
    if (confirmToBeAdmin) {
        commands = [addNewAdminToCommitment(userId, notificationId)];
    }
    await markNotificationAsRead(userId, notificationId, confirmToBeAdmin).send(commands);
};

module.exports = {
    confirmToAddAdminToCommitment
};
