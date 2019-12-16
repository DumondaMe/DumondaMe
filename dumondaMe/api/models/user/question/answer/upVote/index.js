'use strict';

const db = requireDb();
const oneTimeNotifications = require('./oneTimeNotifications');
const time = require('dumonda-me-server-lib').time;
const uuid = require('dumonda-me-server-lib').uuid;
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const validToUpVoteAnswer = async function (userId, answerId) {
    let result = await db.cypher().match(`(user:User {userId: {userId}})-[:UP_VOTE|IS_CREATOR]->
                                          (answer:Answer {answerId: {answerId}})`)
        .return(`answer`).end({answerId, userId}).send();
    if (result.length > 0) {
        throw new exceptions.InvalidOperation(
            `User ${userId} has already up voted answer or is admin of answer ${answerId}`);
    }
};

const addOneTimeNotificationUpVoteFirstAnswer = async function (userId) {
    let response = await db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeUpVoteFirstAnswer'}))`)
        .optionalMatch(`(u)-[:UP_VOTE]->(a:Answer)`)
        .with(`COUNT(a) AS numberOfUpVotes, u`)
        .where(`numberOfUpVotes = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeUpVoteFirstAnswer', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId: uuid.generateUUID(), created: time.getNowUtcTimestamp()}).send();
    return {oneTimeNotificationCreated: response.length === 1};
};


const index = async function (userId, answerId) {
    await validToUpVoteAnswer(userId, answerId);
    await db.cypher().match(`(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})`)
        .merge(`(user)-[:UP_VOTE {created: {created}}]->(answer)`)
        .end({answerId, userId, created: time.getNowUtcTimestamp()}).send();
    logger.info(`User ${userId} up voted answer ${answerId}`);

    return await oneTimeNotifications.addOneTimeNotifications(userId);
};

const deleteUpVote = async function (userId, answerId) {
    await db.cypher().match(`(:User {userId: {userId}})-[upVote:UP_VOTE]->(:Answer {answerId: {answerId}})`)
        .delete(`upVote`)
        .end({answerId, userId}).send();
    logger.info(`User ${userId} deleted up vote for answer ${answerId}`);
};

module.exports = {
    upVote: index,
    deleteUpVote
};
