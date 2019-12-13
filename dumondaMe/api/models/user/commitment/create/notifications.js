'use strict';

const db = requireDb();


const addNotifications = async function (creatorId, commitmentId, created) {
    await db.cypher().match(`(notifiedUser:User)`)
        .where(`NOT notifiedUser.userId = {creatorId} AND NOT notifiedUser:HarvestingUser`)
        .match(`(creator:User {userId: {creatorId}})-[:IS_CREATOR]->(c:Commitment {commitmentId: {commitmentId}})`)
        .merge(`(notifiedUser)<-[:NOTIFIED]-(n:Notification:Unread:NoEmail {type: 'newCommitment', ` +
            `created: {created}, notificationId: randomUUID()})-[:ORIGINATOR_OF_NOTIFICATION]->(creator)`)
        .merge(`(n)-[:NOTIFICATION]->(c)`)
        .end({creatorId, commitmentId, created}).send();
};


module.exports = {
    addNotifications
};
