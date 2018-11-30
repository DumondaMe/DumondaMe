'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;
const db = requireDb();
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getShowQuestionOnCommitmentRequest = function (notification) {
    let commitment = notification.infos.find((info) => typeof info.info.commitmentId === 'string').info;
    let question = notification.infos.find((info) => typeof info.info.questionId === 'string').info;
    return {
        read: notification.read,
        notificationId: notification.notification.notificationId,
        created: notification.notification.created,
        type: notification.notification.type,
        commitmentId: commitment.commitmentId,
        commitmentTitle: commitment.title,
        commitmentSlug: slug(commitment.title),
        questionId: question.questionId,
        question: question.question,
        questionSlug: slug(question.question),
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
            slug: slug(user.name),
            added: created,
            thumbnailUrl: await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
        });
    }
    return {
        read: notification.read,
        notificationId: notification.notification.notificationId,
        users: users,
        numberOfUsers: notification.originators.length,
        created: notification.notification.created,
        type: notification.notification.type
    }
};

const getNotificationAddedToTrustCircle = async function (notification) {
    let index, users = [];
    for (index = 0; index < 3 && index < notification.infos.length; index++) {
        let user = notification.infos[index].info;
        let created = notification.relInfos[index].created;
        users.push({
            userId: user.userId,
            name: user.name,
            slug: slug(user.name),
            added: created,
            thumbnailUrl: await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
        });
    }
    return {
        read: notification.read,
        notificationId: notification.notification.notificationId,
        users: users,
        numberOfUsers: notification.infos.length,
        created: notification.notification.created,
        type: notification.notification.type
    }
};

const addWatchingCommitmentProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'watchingCommitment' && notification.infos.length === 1) {
        notificationResponse.commitmentId = notification.infos[0].info.commitmentId;
        notificationResponse.commitmentTitle = notification.infos[0].info.title;
        notificationResponse.commitmentSlug = slug(notification.infos[0].info.title);
    }
};

const addWatchingQuestionProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'watchingQuestion' && notification.infos.length === 1) {
        notificationResponse.questionId = notification.infos[0].info.questionId;
        notificationResponse.questionTitle = notification.infos[0].info.question;
        notificationResponse.questionSlug = slug(notification.infos[0].info.question);
    }
};

const addCreatedAnswerProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'createdAnswer') {
        let answer = notification.infos.find((info) => typeof info.info.answerId === 'string');
        let question = notification.infos.find((info) => typeof info.info.questionId === 'string').info;
        notificationResponse.questionId = question.questionId;
        notificationResponse.questionTitle = question.question;
        notificationResponse.questionSlug = slug(question.question);
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

const addCreatedNoteProperties = function (notificationResponse, notification) {
    if (notificationResponse.type === 'createdNote') {
        let answer = notification.infos.find((info) => typeof info.info.answerId === 'string');
        let question = notification.infos.find((info) => typeof info.info.questionId === 'string').info;
        let note = notification.infos.find((info) => typeof info.info.noteId === 'string').info;
        notificationResponse.questionId = question.questionId;
        notificationResponse.questionTitle = question.question;
        notificationResponse.questionSlug = slug(question.question);
        notificationResponse.answerId = answer.info.answerId;
        notificationResponse.answerType = answer.type.filter(
            (l) => ['Youtube', 'Text', 'Link', 'Book'].some(v => v === l))[0];
        notificationResponse.noteId = note.noteId;
        notificationResponse.noteText = note.text;

        if (notificationResponse.answerType === 'Text') {
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
        } else if (notification.notification.type === 'addedToTrustCircle') {
            response.push(await getNotificationAddedToTrustCircle(notification));
        } else if (
            notification.notification.type === 'watchingCommitment' ||
            notification.notification.type === 'watchingQuestion' ||
            notification.notification.type === 'createdAnswer' ||
            notification.notification.type === 'createdNote') {
            let notificationResponse = await getNotificationWithOriginators(notification);
            addWatchingCommitmentProperties(notificationResponse, notification);
            addWatchingQuestionProperties(notificationResponse, notification);
            addCreatedAnswerProperties(notificationResponse, notification);
            addCreatedNoteProperties(notificationResponse, notification);
            response.push(notificationResponse);
        }
    }
    return response;
};

const getNumberOfUnreadNotificationsCommand = function (userId) {
    return db.cypher().match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification:Unread)`)
        .return(`COUNT(DISTINCT n) AS numberOfUnreadNotifications`)
        .end({userId});
};

const getNumberOfUnreadNotifications = async function (userId) {
    let result = await getNumberOfUnreadNotificationsCommand(userId).send();
    return {numberOfUnreadNotifications: result[0].numberOfUnreadNotifications};
};

const getNotifications = async function (userId) {
    let result = await db.cypher()
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)`)
        .optionalMatch(`(n)-[relInfo:NOTIFICATION]->(info)`)
        .optionalMatch(`(n)-[relOriginator:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
        .with(`n, info, relInfo, originator, relOriginator`)
        .orderBy(`relOriginator.created DESC, relInfo.created DESC`)
        .return(`DISTINCT n AS notification, collect(DISTINCT {info: info, type: labels(info)}) AS infos, 
                 collect(DISTINCT relInfo) AS relInfos, none(label in labels(n) WHERE label = 'Unread') AS read,
                 collect(DISTINCT originator) AS originators, collect(DISTINCT relOriginator) AS relOriginators`)
        .orderBy(`n.created DESC`)
        .end({userId}).send([getNumberOfUnreadNotificationsCommand(userId).getCommand()]);
    logger.info(`User ${userId} requested notifications`);
    return {
        notifications: await getResponse(result[1]),
        numberOfUnreadNotifications: result[0][0].numberOfUnreadNotifications
    };
};

module.exports = {
    getNotifications,
    getNumberOfUnreadNotifications
};
