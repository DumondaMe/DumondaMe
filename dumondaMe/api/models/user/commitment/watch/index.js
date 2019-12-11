'use strict';

const db = requireDb();
const harvestingUser = require('./../../../userHarvesting/security');
const oneTimeNotifications = require('./oneTimeNotifications');
const exceptions = require('dumonda-me-server-lib').exceptions;
const time = require('dumonda-me-server-lib').time;
const uuid = require('dumonda-me-server-lib').uuid;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const addWatchNotificationExists = function (userId, commitmentId, watchAdded) {
    return db.cypher().match(`(admin:User)-[:IS_ADMIN]->(c:Commitment {commitmentId: {commitmentId}})<-[:NOTIFICATION]-
                (n:Notification:Unread {type: 'watchingCommitment'})`)
        .where(`(n)-[:NOTIFIED]->(admin) AND NOT (:User {userId: {userId}})<-[:ORIGINATOR_OF_NOTIFICATION]-(n)`)
        .set(`n`, {created: watchAdded})
        .with(`n`)
        .match(`(u:User {userId: {userId}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {watchAdded}}]->(u)`)
        .end({userId, commitmentId, watchAdded})
};

const addWatchNotificationNotExists = function (userId, commitmentId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(admin:User)-[:IS_ADMIN]->(c:Commitment {commitmentId: {commitmentId}})`)
        .where(`NOT (c)<-[:NOTIFICATION]-(:Notification:Unread {type: 'watchingCommitment'})-[:NOTIFIED]->(admin)
        AND NOT (:User {userId: {userId}})<-[:ORIGINATOR_OF_NOTIFICATION]-(:Notification {type: 'watchingCommitment'})-[:NOTIFICATION]->(c)`)
        .merge(`(c)<-[:NOTIFICATION]-(n:Notification:Unread {type: 'watchingCommitment', created: {watchAdded}, 
                 notificationId: {notificationId}})`)
        .merge(`(n)-[:NOTIFIED]->(admin)`)
        .with(`n`)
        .match(`(u:User {userId: {userId}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {watchAdded}}]->(u)`)
        .end({userId, commitmentId, notificationId, watchAdded})
};

const addWatch = async function (userId, commitmentId) {
    let created = time.getNowUtcTimestamp();

    await harvestingUser.notAllowedToPerformAction(userId, logger);
    let response = await db.cypher()
        .match(`(user:User {userId: {userId}}), (commitment:Commitment {commitmentId: {commitmentId}})`)
        .where(`NOT (user)-[:WATCH]->(commitment) AND NOT (user)-[:IS_ADMIN]->(commitment)`)
        .merge(`(user)-[:WATCH {created: {created}}]->(commitment)`)
        .return(`user`)
        .end({userId, commitmentId, created}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`Watch could not be added from user ${userId} to commitment ${commitmentId}`);
    } else {
        await addWatchNotificationExists(userId, commitmentId, created).send(
            [addWatchNotificationNotExists(userId, commitmentId, created).getCommand()]
        );
    }
    logger.info(`User watches commitment ${commitmentId}`);
    return await oneTimeNotifications.addOneTimeNotifications(userId, created);
};

const removeWatchNotification = function (userId, commitmentId) {
    return db.cypher().match(`(u:User {userId: {userId}})<-[rel:ORIGINATOR_OF_NOTIFICATION]-
          (n:Notification {type: 'watchingCommitment'})-[:NOTIFICATION]->(c:Commitment {commitmentId: {commitmentId}})`)
        .delete(`rel`)
        .with(`n`)
        .match('(c:Commitment)<-[relC:NOTIFICATION]-(n)-[notified:NOTIFIED]->(:User)')
        .where(`NOT (n)-[:ORIGINATOR_OF_NOTIFICATION]->(:User)`)
        .delete(`n, notified, relC`)
        .end({userId, commitmentId}).getCommand()
};

const removeWatch = async function (userId, commitmentId) {

    await db.cypher()
        .match(`(:User {userId: {userId}})-[watch:WATCH]->(:Commitment {commitmentId: {commitmentId}})`)
        .delete(`watch`)
        .end({userId, commitmentId}).send([removeWatchNotification(userId, commitmentId)]);

    logger.info(`User removed watch of commitment ${commitmentId}`)
};

module.exports = {
    addWatch,
    removeWatch
};
