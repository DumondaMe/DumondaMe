'use strict';

const dashify = require('dashify');
const cdn = require('elyoos-server-lib').cdn;
const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getShowQuestionOnCommitmentRequest = function (notification) {
    let commitment = notification.infos.find((info) => typeof info.commitmentId === 'string');
    let question = notification.infos.find((info) => typeof info.questionId === 'string');
    return {
        notificationId: notification.notification.notificationId,
        created: notification.notification.created,
        type: notification.notification.type,
        commitmentId: commitment.commitmentId,
        commitmentTitle: commitment.title,
        commitmentSlug: dashify(commitment.title),
        questionId: question.questionId,
        question: question.question,
        questionSlug: dashify(question.question),
    }
};

const getUserAddedToTrustCircle = async function (notification) {
    let index, users = [];
    for (index = 0; index < 3 && index < notification.infos.length; index++) {
        let user = notification.infos[index];
        let created = notification.relInfos[index].created;
        users.push({
            userId: user.userId,
            name: user.name,
            slug: dashify(user.name),
            added: created,
            thumbnailUrl: await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
        });
    }
    return {
        notificationId: notification.notification.notificationId,
        users: users,
        numberOfAddedUsers: notification.infos.length,
        created: notification.notification.created,
        type: notification.notification.type
    }
};

const getResponse = async function (notifications) {
    let response = [];
    for (let notification of notifications) {
        if (notification.notification.type === 'showQuestionRequest') {
            response.push(getShowQuestionOnCommitmentRequest(notification));
        } else if (notification.notification.type === 'addedToTrustCircle') {
            response.push(await getUserAddedToTrustCircle(notification));
        }
    }
    return response;
};

const getNumberOfNotificationsCommand = function (userId) {
    return db.cypher().match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)`)
        .return(`COUNT(DISTINCT n) AS numberOfNotifications`)
        .end({userId});
};

const getNumberOfNotifications = async function (userId) {
    let result = await getNumberOfNotificationsCommand(userId).send();
    return {numberOfNotifications: result[0].numberOfNotifications};
};

const getNotifications = async function (userId) {
    let result = await db.cypher()
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)-[relInfo:NOTIFICATION]->(info)`)
        .with(`n, info, relInfo`)
        .orderBy(`relInfo.created DESC`)
        .return(`n AS notification, collect(info) AS infos, collect(relInfo) AS relInfos`)
        .orderBy(`n.created DESC`)
        .end({userId}).send([getNumberOfNotificationsCommand(userId).getCommand()]);
    logger.info(`User ${userId} requested notifications`);
    return {
        notifications: await getResponse(result[1]),
        numberOfNotifications: result[0][0].numberOfNotifications
    };
};

module.exports = {
    getNotifications,
    getNumberOfNotifications
};
