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

const addOneTimeNotificationChallengeCreateCommitment = function (userId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeChallengeCreateCommitment'})) AND ` +
            `NOT EXISTS((u)-[:IS_CREATOR]->(:Commitment))`)
        .optionalMatch(`(u)-[:WATCH]->(c:Commitment)`)
        .with(`COUNT(c) AS numberOfWatches, u`)
        .where(`numberOfWatches > 2`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeCreateCommitment', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, created})
};

const addOneTimeNotifications = async function (userId, watchAdded) {
    let response = await addOneTimeNotificationWatchFirstCommitment(userId, watchAdded).send([
        addOneTimeNotificationChallengeCreateCommitment(userId, watchAdded).getCommand()
    ]);
    return {
        oneTimeNotificationCreated: response[0].length === 1 || response[1].length === 1
    };
};


module.exports = {
    addOneTimeNotifications
};
