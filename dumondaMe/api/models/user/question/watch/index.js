'use strict';

const db = requireDb();
const harvestingUser = require('./../../../userHarvesting/security');
const oneTimeNotifications = require('./oneTimeNotifications');
const exceptions = require('dumonda-me-server-lib').exceptions;
const time = require('dumonda-me-server-lib').time;
const uuid = require('dumonda-me-server-lib').uuid;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const addWatchNotificationExists = function (userId, questionId, watchAdded) {
    return db.cypher().match(`(creator:User)-[:IS_CREATOR]->(q:Question {questionId: {questionId}})<-[:NOTIFICATION]-
                (n:Notification:Unread {type: 'watchingQuestion'})`)
        .where(`(n)-[:NOTIFIED]->(creator) AND NOT (:User {userId: {userId}})<-[:ORIGINATOR_OF_NOTIFICATION]-(n)`)
        .set(`n`, {created: watchAdded})
        .with(`n`)
        .match(`(u:User {userId: {userId}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {watchAdded}}]->(u)`)
        .end({userId, questionId, watchAdded})
};

const addWatchNotificationNotExists = function (userId, questionId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(creator:User)-[:IS_CREATOR]->(q:Question {questionId: {questionId}})`)
        .where(`NOT (q)<-[:NOTIFICATION]-(:Notification:Unread {type: 'watchingQuestion'})-[:NOTIFIED]->(creator)
                AND NOT (:User {userId: {userId}})<-[:ORIGINATOR_OF_NOTIFICATION]-(:Notification {type: 'watchingQuestion'})-[:NOTIFICATION]->(q)`)
        .merge(`(q)<-[:NOTIFICATION]-(n:Notification:Unread {type: 'watchingQuestion', created: {watchAdded}, 
                 notificationId: {notificationId}})`)
        .merge(`(n)-[:NOTIFIED]->(creator)`)
        .with(`n`)
        .match(`(u:User {userId: {userId}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {watchAdded}}]->(u)`)
        .end({userId, questionId, notificationId, watchAdded})
};

const addWatch = async function (userId, questionId) {
    let created = time.getNowUtcTimestamp();

    await harvestingUser.notAllowedToPerformAction(userId, logger);
    let response = await db.cypher()
        .match(`(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})`)
        .where(`NOT (user)-[:WATCH]->(question) AND NOT (user)-[:IS_CREATOR]->(question)`)
        .merge(`(user)-[:WATCH {created: {created}}]->(question)`)
        .return(`user`)
        .end({userId, questionId, created}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`Watch could not be added from user ${userId} to question ${questionId}`);
    } else {
        await addWatchNotificationExists(userId, questionId, created).send([
            addWatchNotificationNotExists(userId, questionId, created).getCommand()]);
        logger.info(`User watches question ${questionId}`);
        return await oneTimeNotifications.addOneTimeNotifications(userId, created);
    }
};

const removeWatchNotification = function (userId, questionId) {
    return db.cypher().match(`(u:User {userId: {userId}})<-[rel:ORIGINATOR_OF_NOTIFICATION]-
          (n:Notification {type: 'watchingQuestion'})-[:NOTIFICATION]->(q:Question {questionId: {questionId}})`)
        .delete(`rel`)
        .with(`n, q`)
        .match('(q)<-[relC:NOTIFICATION]-(n)-[notified:NOTIFIED]->(:User)')
        .where(`NOT (n)-[:ORIGINATOR_OF_NOTIFICATION]->(:User)`)
        .delete(`n, notified, relC`)
        .end({userId, questionId}).getCommand()
};

const removeWatch = async function (userId, questionId) {

    await db.cypher().match(`(:User {userId: {userId}})-[watch:WATCH]->(:Question {questionId: {questionId}})`)
        .delete(`watch`)
        .end({userId, questionId}).send([removeWatchNotification(userId, questionId)]);

    logger.info(`User removed watch of question ${questionId}`)
};

module.exports = {
    addWatch,
    removeWatch
};
