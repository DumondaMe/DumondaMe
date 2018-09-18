'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const time = require('dumonda-me-server-lib').time;
const uuid = require('dumonda-me-server-lib').uuid;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const addWatchNotificationExists = function (userId, questionId, watchAdded) {
    return db.cypher().match(`(creator:User)-[:IS_CREATOR]->(q:Question {questionId: {questionId}})<-[:NOTIFICATION]-
                (n:Notification {type: 'watchingQuestion'})`)
        .where(`(n)-[:NOTIFIED]->(creator) AND NOT (:User {userId: {userId}})<-[:ORIGINATOR_OF_NOTIFICATION]-(n)`)
        .set(`n`, {created: watchAdded})
        .with(`n`)
        .match(`(u:User {userId: {userId}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {watchAdded}}]->(u)`)
        .end({userId, questionId, watchAdded}).getCommand()
};

const addWatchNotificationNotExists = function (userId, questionId, watchAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(creator:User)-[:IS_CREATOR]->(q:Question {questionId: {questionId}})`)
        .where(`NOT (q)<-[:NOTIFICATION]-(:Notification {type: 'watchingQuestion'})-[:NOTIFIED]->(creator)`)
        .merge(`(q)<-[:NOTIFICATION]-(n:Notification {type: 'watchingQuestion', created: {watchAdded}, 
                 notificationId: {notificationId}})`)
        .merge(`(n)-[:NOTIFIED]->(creator)`)
        .with(`n`)
        .match(`(u:User {userId: {userId}})`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {watchAdded}}]->(u)`)
        .end({userId, questionId, notificationId, watchAdded}).getCommand()
};

const addWatch = async function (userId, questionId) {
    let commands = [], created = time.getNowUtcTimestamp();
    commands.push(addWatchNotificationExists(userId, questionId, created));
    commands.push(addWatchNotificationNotExists(userId, questionId, created));

    let response = await db.cypher()
        .match(`(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})`)
        .where(`NOT (user)-[:WATCH]->(question) AND NOT (user)-[:IS_CREATOR]->(question)`)
        .merge(`(user)-[:WATCH {created: {created}}]->(question)`)
        .return(`user`)
        .end({userId, questionId, created}).send(commands);

    if (response[2].length === 0) {
        throw new exceptions.InvalidOperation(`Watch could not be added from user ${userId} to question ${questionId}`);
    }

    logger.info(`User watches question ${questionId}`)
};

const removeWatchNotification = function (userId, questionId) {
    return db.cypher().match(`(u:User {userId: {userId}})<-[rel:ORIGINATOR_OF_NOTIFICATION]-
          (n:Notification {type: 'watchingQuestion'})-[:NOTIFICATION]->(q:Question {questionId: {questionId}})`)
        .delete(`rel`)
        .with(`n, q`)
        .match('(q)<-[relC:NOTIFICATION]-(notification)-[notified:NOTIFIED]->(:User)')
        .where(`NOT (notification)-[:ORIGINATOR_OF_NOTIFICATION]->(:User)`)
        .delete(`notification, notified, relC`)
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
