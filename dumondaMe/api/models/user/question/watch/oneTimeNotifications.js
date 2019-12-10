'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;

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
        .where(`numberOfWatches = 4`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeUpVoteAnswer', ` +
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
    let response = await addOneTimeNotificationWatchFirstQuestion(userId, watchAdded)
        .send([addOneTimeNotificationChallengeUpVoteAnswer(userId, watchAdded).getCommand(),
            addOneTimeNotificationInviteFriends(userId, watchAdded).getCommand()]);
    return {
        oneTimeNotificationCreated: response[0].length === 1 || response[1].length === 1 || response[2].length === 1
    };
};


module.exports = {
    addOneTimeNotifications
};
