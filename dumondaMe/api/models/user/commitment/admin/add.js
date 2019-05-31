'use strict';

const db = requireDb();
const commitmentSecurity = require('./../security');
const uuid = require('dumonda-me-server-lib').uuid;
const time = require('dumonda-me-server-lib').time;
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const addAdminOnlyOnce = async function (newAdminId, commitmentId) {
    let response = await db.cypher().match(`(commitment:Commitment {commitmentId: {commitmentId}})
                 <-[:IS_ADMIN]-(:User {userId: {newAdminId}})`)
        .return(`commitment`)
        .end({commitmentId, newAdminId}).send();

    if (response.length === 1) {
        throw new exceptions.InvalidOperation(`User ${newAdminId} is already admin of commitment ${commitmentId}`);
    }
};

const requestIsPending = async function (newAdminId, commitmentId) {
    let response = await db.cypher()
        .match(`(u:User {userId: {newAdminId}})<-[:NOTIFIED]-
                (:Notification:Unread {type: 'requestAdminOfCommitment'})-[:NOTIFICATION]
                ->(:Commitment {commitmentId: {commitmentId}})`)
        .return(`u`)
        .end({commitmentId, newAdminId}).send();

    if (response.length === 1) {
        throw new exceptions.InvalidOperation(
            `Request to be admin of commitment ${commitmentId} for user ${newAdminId} is pending`);
    }
};

const add = async function (userId, newAdminId, commitmentId) {
    await commitmentSecurity.isAdmin(userId, commitmentId);
    await addAdminOnlyOnce(newAdminId, commitmentId);
    await requestIsPending(newAdminId, commitmentId);
    await db.cypher()
        .match(`(admin:User {userId: {userId}})-[:IS_ADMIN]->(commitment:Commitment {commitmentId: {commitmentId}})`)
        .create(`(n:Notification:Unread {notificationId: {notificationId}, type: 'requestAdminOfCommitment', 
                 created: {created}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION]->(admin)`)
        .merge(`(n)-[:NOTIFICATION]->(commitment)`)
        .with(`n`)
        .match(`(u:User {userId: {newAdminId}})`)
        .merge(`(n)-[:NOTIFIED]->(u)`)
        .end({
            userId, newAdminId, commitmentId, notificationId: uuid.generateUUID(), created: time.getNowUtcTimestamp()
        }).send();

    logger.info(`Admin ${userId} of commitment ${commitmentId} has user ${newAdminId} request to be admin.`);
};

module.exports = {
    add
};
