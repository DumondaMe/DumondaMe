'use strict';

const db = requireDb();
const notification = requireModel('user/notification/challengeCompleteNotification');

const createNewCommitmentNotifications = function (creatorId, commitmentId, created) {
    return db.cypher().match(`(notifiedUser:User)`)
        .where(`NOT notifiedUser.userId = {creatorId} AND NOT notifiedUser:HarvestingUser`)
        .match(`(creator:User {userId: {creatorId}})-[:IS_CREATOR]->(c:Commitment {commitmentId: {commitmentId}})`)
        .merge(`(notifiedUser)<-[:NOTIFIED]-(n:Notification:Unread:NoEmail {type: 'newCommitment', ` +
            `created: {created}, notificationId: randomUUID()})-[:ORIGINATOR_OF_NOTIFICATION]->(creator)`)
        .merge(`(n)-[:NOTIFICATION]->(c)`)
        .end({creatorId, commitmentId, created})
};

const createNewCommitmentCreatorNotification = function (creatorId, commitmentId, created) {
    return db.cypher()
        .match(`(creator:User {userId: {creatorId}})-[:IS_CREATOR]->(c:Commitment {commitmentId: {commitmentId}})`)
        .merge(`(creator)<-[:NOTIFIED]-(n:Notification:Unread:NoEmail {type: 'newCommitmentCreator', ` +
            `created: {created}, notificationId: randomUUID()})-[:NOTIFICATION]->(c)`)
        .merge(`(n)-[:NOTIFICATION]->(c)`)
        .end({creatorId, commitmentId, created})
};

const addOneTimeNotificationFirstCommitment = function (userId, created) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeFirstCommitment'}))`)
        .optionalMatch(`(u)-[:IS_CREATOR]->(c:Commitment)`)
        .with(`COUNT(c) AS numberOfCommitments, u`)
        .where(`numberOfCommitments = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeFirstCommitment', ` +
            `created: {created}, notificationId: randomUUID()})`)
        .return('u')
        .end({userId, created})
};

const addNotifications = async function (creatorId, commitmentId, created) {
    let response = await createNewCommitmentNotifications(creatorId, commitmentId, created).send(
        [addOneTimeNotificationFirstCommitment(creatorId, created).getCommand(),
            notification.addOneTimeNotificationChallengeComplete(creatorId, created).getCommand(),
            createNewCommitmentCreatorNotification(creatorId, commitmentId, created).getCommand()]);
    return response[0].length === 1 || response[1].length === 1;
};


module.exports = {
    addNotifications
};
