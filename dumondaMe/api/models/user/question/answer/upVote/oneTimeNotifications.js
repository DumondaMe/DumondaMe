'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;

const addOneTimeNotificationUpVoteFirstAnswer = function (userId) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeUpVoteFirstAnswer'}))`)
        .optionalMatch(`(u)-[:UP_VOTE]->(a:Answer)`)
        .with(`COUNT(a) AS numberOfUpVotes, u`)
        .where(`numberOfUpVotes = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeUpVoteFirstAnswer', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId: uuid.generateUUID(), created: time.getNowUtcTimestamp()});
};

const addOneTimeNotificationInviteFriends = function (userId) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeInviteFriends'}))`)
        .optionalMatch(`(u)-[:UP_VOTE]->(a:Answer)`)
        .with(`COUNT(a) AS numberOfUpVotes, u`)
        .where(`numberOfUpVotes > 4`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeInviteFriends', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId: uuid.generateUUID(), created: time.getNowUtcTimestamp()})
};

const addOneTimeNotifications = async function (userId) {
    let response = await addOneTimeNotificationUpVoteFirstAnswer(userId)
        .send([addOneTimeNotificationInviteFriends(userId).getCommand()]);
    return {
        oneTimeNotificationCreated: response[0].length === 1 || response[1].length === 1
    };
};


module.exports = {
    addOneTimeNotifications
};
