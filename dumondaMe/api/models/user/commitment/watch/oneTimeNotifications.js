'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;

const addOneTimeNotificationWatchFirstCommitment = function (userId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeWatchingFirstCommitment'}))`)
        .optionalMatch(`(u)-[:WATCH]->(c:Commitment)`)
        .with(`COUNT(c) AS numberOfCommitment, u`)
        .where(`numberOfCommitment = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeWatchingFirstCommitment', ` +
            `created: {watchAdded}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, watchAdded})
};

const addOneTimeNotifications = async function (userId, watchAdded) {
    let response = await addOneTimeNotificationWatchFirstCommitment(userId, watchAdded).send();
    return {
        oneTimeNotificationCreated: response.length === 1
    };
};


module.exports = {
    addOneTimeNotifications
};
