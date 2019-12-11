'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;

const addOneTimeNotificationFirstTrustCircleUser = function (userId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeFirstTrustCircleUser'}))`)
        .optionalMatch(`(u)-[:IS_CONTACT]->(contact:User)`)
        .with(`COUNT(contact) AS numberOfContacts, u`)
        .where(`numberOfContacts = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeFirstTrustCircleUser', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, created})
};

const addOneTimeNotificationChallengeWatchCommitment = function (userId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeChallengeWatchCommitment'})) AND ` +
            `NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeWatchingFirstCommitment'}))`)
        .optionalMatch(`(u)-[:IS_CONTACT]->(contact:User)`)
        .optionalMatch(`(u)-[:WATCH]->(commitment:Commitment)`)
        .with(`COUNT(contact) AS numberOfContacts, COUNT(commitment) AS numberOfCommitment, u`)
        .where(`numberOfContacts = 3 AND numberOfCommitment = 0`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeWatchCommitment', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, created})
};

const addOneTimeNotifications = async function (userId, created) {
    let response = await addOneTimeNotificationFirstTrustCircleUser(userId, created).send([
        addOneTimeNotificationChallengeWatchCommitment(userId, created).getCommand()
    ]);
    return {oneTimeNotificationCreated: response[0].length === 1 || response[1].length === 1};
};


module.exports = {
    addOneTimeNotifications
};
