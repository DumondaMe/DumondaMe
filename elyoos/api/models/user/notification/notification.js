'use strict';

const dashify = require('dashify');
const cdn = require('elyoos-server-lib').cdn;
const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getShowQuestionOnCommitmentRequest = function (notification) {
    let commitment = notification.infos.find((info) => typeof info.info.commitmentId === 'string').info;
    let question = notification.infos.find((info) => typeof info.info.questionId === 'string').info;
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

const getNotificationWithOriginators = async function (notification) {
    let index, users = [];
    for (index = 0; index < 3 && index < notification.originators.length; index++) {
        let user = notification.originators[index];
        let created = notification.relOriginators[index].created;
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
        numberOfUsers: notification.originators.length,
        created: notification.notification.created,
        type: notification.notification.type
    }
};

const addWatchingCommitmentProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'watchingCommitment' && notification.infos.length === 1) {
        notificationResponse.commitmentId = notification.infos[0].info.commitmentId;
        notificationResponse.commitmentTitle = notification.infos[0].info.title;
        notificationResponse.commitmentSlug = dashify(notification.infos[0].info.title);
    }
};

const addWatchingQuestionProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'watchingQuestion' && notification.infos.length === 1) {
        notificationResponse.questionId = notification.infos[0].info.questionId;
        notificationResponse.questionTitle = notification.infos[0].info.question;
        notificationResponse.questionSlug = dashify(notification.infos[0].info.question);
    }
};

const addCreatedAnswerProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'createdAnswer') {
        let answer = notification.infos.find((info) => typeof info.info.answerId === 'string');
        let question = notification.infos.find((info) => typeof info.info.questionId === 'string').info;
        notificationResponse.questionId = question.questionId;
        notificationResponse.questionTitle = question.question;
        notificationResponse.questionSlug = dashify(question.question);
        notificationResponse.answerId = answer.info.answerId;
        notificationResponse.answerType = answer.type.filter(
            (l) => ['Youtube', 'Text', 'Link', 'Book', 'CommitmentAnswer'].some(v => v === l))[0];

        if (notificationResponse.answerType === 'CommitmentAnswer') {
            let commitment = notification.infos.find((info) => typeof info.info.commitmentId === 'string').info;
            notificationResponse.answerTitle = commitment.title;
        } else if (notificationResponse.answerType === 'Text') {
            notificationResponse.answerTitle = answer.info.answer;
        } else {
            notificationResponse.answerTitle = answer.info.title;
        }
    }
};

const getResponse = async function (notifications) {
    let response = [];
    for (let notification of notifications) {
        if (notification.notification.type === 'showQuestionRequest') {
            response.push(getShowQuestionOnCommitmentRequest(notification));
        } else if (notification.notification.type === 'addedToTrustCircle' ||
            notification.notification.type === 'watchingCommitment' ||
            notification.notification.type === 'watchingQuestion' ||
            notification.notification.type === 'createdAnswer') {
            let notificationResponse = await getNotificationWithOriginators(notification);
            addWatchingCommitmentProperties(notificationResponse, notification);
            addWatchingQuestionProperties(notificationResponse, notification);
            addCreatedAnswerProperties(notificationResponse, notification);
            response.push(notificationResponse);
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
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)`)
        .optionalMatch(`(n)-[relInfo:NOTIFICATION]->(info)`)
        .optionalMatch(`(n)-[relOriginator:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
        .with(`n, info, relInfo, originator, relOriginator`)
        .orderBy(`relOriginator.created DESC, relInfo.created DESC`)
        .return(`DISTINCT n AS notification, collect(DISTINCT {info: info, type: labels(info)}) AS infos, 
                 collect(DISTINCT relInfo) AS relInfos,
                 collect(DISTINCT originator) AS originators, collect(DISTINCT relOriginator) AS relOriginators`)
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
