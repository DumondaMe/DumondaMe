'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const notification = requireModel('user/notification/challengeCompleteNotification');

const addOneTimeNotificationWatchFirstQuestion = function (userId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeWatchingFirstQuestion'}))`)
        .optionalMatch(`(u)-[:WATCH]->(q:Question)`)
        .with(`COUNT(q) AS numberOfWatches, u`)
        .where(`numberOfWatches = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeWatchingFirstQuestion', ` +
            `created: {watchAdded}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, watchAdded})
};

const addOneTimeNotificationChallengeUpVoteAnswer = function (userId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeChallengeUpVoteAnswer'})) AND ` +
            `NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeUpVoteFirstAnswer'}))`)
        .optionalMatch(`(u)-[:WATCH]->(q:Question)`)
        .with(`COUNT(q) AS numberOfWatches, u`)
        .where(`numberOfWatches = 3`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeUpVoteAnswer', ` +
            `created: {watchAdded}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, watchAdded})
};

const addOneTimeNotificationChallengeWatchCommitment = function (userId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeChallengeWatchCommitment'})) AND ` +
            `NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeWatchingFirstCommitment'}))`)
        .optionalMatch(`(u)-[:WATCH]->(q:Question)`)
        .optionalMatch(`(u)-[:WATCH]->(commitment:Commitment)`)
        .with(`COUNT(q) AS numberOfWatches, COUNT(commitment) AS numberOfCommitment, u`)
        .where(`numberOfWatches = 5 AND numberOfCommitment = 0`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeWatchCommitment', ` +
            `created: {watchAdded}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, watchAdded})
};

const addOneTimeNotificationInviteFriends = function (userId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeInviteFriends'}))`)
        .optionalMatch(`(u)-[:WATCH]->(q:Question)`)
        .with(`COUNT(q) AS numberOfWatches, u`)
        .where(`numberOfWatches > 6`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeInviteFriends', ` +
            `created: {watchAdded}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, watchAdded})
};

const addOneTimeNotifications = async function (userId, watchAdded) {
    let response = await addOneTimeNotificationChallengeUpVoteAnswer(userId, watchAdded)
        .send([addOneTimeNotificationWatchFirstQuestion(userId, watchAdded).getCommand(),
            addOneTimeNotificationInviteFriends(userId, watchAdded).getCommand(),
            addOneTimeNotificationChallengeWatchCommitment(userId, watchAdded).getCommand(),
            notification.addOneTimeNotificationChallengeComplete(userId, watchAdded).getCommand()]);
    return {
        oneTimeNotificationCreated: response[0].length === 1 || response[1].length === 1
            || response[2].length === 1 || response[3].length === 1 || response[4].length === 1
    };
};


module.exports = {
    addOneTimeNotifications,
    addOneTimeNotificationChallengeWatchCommitment
};
