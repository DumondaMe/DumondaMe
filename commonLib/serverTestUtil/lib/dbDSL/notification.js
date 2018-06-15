'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');

const showQuestionOnCommitmentRequest = function (notificationId, data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}}), (admin:User {userId: {adminId}}), 
                (q:Question {questionId: {questionId}})`)
        .merge(`(q)<-[:NOTIFICATION]-(notification:Notification {type: 'showQuestionRequest', 
                                      created: {created}, notificationId: {notificationId}})-[:NOTIFIED]->(admin)`)
        .merge(`(c)<-[:NOTIFICATION]-(notification)`)
        .end({
            notificationId,
            commitmentId: data.commitmentId,
            questionId: data.questionId,
            adminId: data.adminId,
            created: data.created
        }).getCommand());
};

const userAddedToTrustCircle = function (notificationId, data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(userAddedToTrustCircle:User {userId: {userId}})`)
        .merge(`(userAddedToTrustCircle)<-[:NOTIFIED]-(notification:Notification {type: 'addedToTrustCircle', 
                                      created: {created}, notificationId: {notificationId}})`)
        .with(`notification`)
        .unwind(`{trustCircleUsers} AS trustCircleUser`)
        .match(`(user:User)`)
        .where(`user.userId = trustCircleUser.userId`)
        .merge(`(user)<-[:NOTIFICATION {created: trustCircleUser.created}]-(notification)`)
        .end({
            notificationId,
            userId: data.userId,
            trustCircleUsers: data.trustCircleUsers,
            created: data.created
        }).getCommand());
};

const userWatchesCommitment = function (notificationId, data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .merge(`(notification:Notification {type: 'watchingCommitment', 
                                      created: {created}, notificationId: {notificationId}})`)
        .with(`notification`)
        .match(`(admin:User)-[:IS_ADMIN]->(c:Commitment {commitmentId: {commitmentId}})`)
        .merge(`(admin)<-[:NOTIFIED]-(notification)`)
        .merge(`(c)<-[:NOTIFICATION]-(notification)`)
        .with(`notification`)
        .unwind(`{watchingUsers} AS watchingUsers`)
        .match(`(user:User)`)
        .where(`user.userId = watchingUsers.userId`)
        .merge(`(user)<-[:ORIGINATOR_OF_NOTIFICATION {created: watchingUsers.created}]-(notification)`)
        .end({
            notificationId,
            commitmentId: data.commitmentId,
            watchingUsers: data.watchingUsers,
            created: data.created
        }).getCommand());
};

module.exports = {
    showQuestionOnCommitmentRequest,
    userAddedToTrustCircle,
    userWatchesCommitment
};