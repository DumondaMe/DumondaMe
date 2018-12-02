'use strict';

const moreSearchResult = require('../../util/moreSearchResults');
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
        showQuestion: notification.notification.showQuestion,
        commitmentId: commitment.commitmentId,
        commitmentTitle: commitment.title,
        commitmentSlug: slug(commitment.title),
        questionId: question.questionId,
        question: question.question,
        questionSlug: slug(question.question),
    }
};

const getUser = async function (user, created, isContact) {
    let isAnonymous = user.privacyMode === 'onlyContact' && !isContact, thumbnailUrl;
    if (isAnonymous) {
        thumbnailUrl = await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`)
    } else {
        thumbnailUrl = await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
    }
    return {
        userId: user.userId, name: user.name, slug: slug(user.name), added: created,
        thumbnailUrl, isAnonymous
    }
};

const getNotificationWithOriginators = async function (notification) {
    let index, users = [];
    for (index = 0; index < 3 && index < notification.originators.length; index++) {
        let user = notification.originators[index].originator;
        let created = notification.originators[index].relOriginator.created;
        let isContact = notification.originators[index].isContact;
        users.push(await getUser(user, created, isContact));
    }
    return {
        read: notification.read,
        notificationId: notification.notification.notificationId,
        users: users,
        numberOfUsers: notification.numberOfOriginators,
        created: notification.notification.created,
        type: notification.notification.type
    }
};

const getNotificationAddedToTrustCircle = async function (notification) {
    let index, users = [];
    for (index = 0; index < 3 && index < notification.infos.length; index++) {
        let user = notification.infos[index].info;
        let created = notification.relInfos[index].created;
        let isContact = notification.relInfos[index].isContact;
        users.push(await getUser(user, created, isContact));
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
        } else {
            let notificationResponse = await getNotificationWithOriginators(notification);
            //response.push(await getNotificationAddedToTrustCircle(notification));
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

const getNotifications = async function (userId, skip, limit) {
    let result = await db.cypher()
        .match(`(u:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)`)
        .with(`u, n`)
        .orderBy(`n.created DESC`)
        .skip(`{skip}`).limit(`{limit}`)
        .optionalMatch(`(n)-[:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
        .with(`u, n, count(originator) AS numberOfOriginators`)
        .optionalMatch(`(n)-[relInfo:NOTIFICATION]->(info)`)
        .optionalMatch(`(n)-[relOriginator:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
        .with(`n, info, relInfo, originator, relOriginator, numberOfOriginators`)
        .orderBy(`relOriginator.created DESC, relInfo.created DESC`)
        .return(`DISTINCT n AS notification, collect(DISTINCT {info: info, type: labels(info)}) AS infos, 
                 collect(DISTINCT relInfo) AS relInfos, none(label in labels(n) WHERE label = 'Unread') AS read,
                 collect(DISTINCT {originator: originator, relOriginator: relOriginator,
                 isContact: EXISTS((:User {userId: {userId}})<-[:IS_CONTACT]-(originator))})[0..3] AS originators,
                 numberOfOriginators`)
        .orderBy(`n.created DESC`)
        .end({userId, skip, limit: limit + 1}).send([getNumberOfUnreadNotificationsCommand(userId).getCommand()]);
    logger.info(`User ${userId} requested notifications`);
    let hasMoreNotifications = moreSearchResult.getHasMoreResults(result[1], limit);
    return {
        notifications: await getResponse(result[1]), hasMoreNotifications,
        numberOfUnreadNotifications: result[0][0].numberOfUnreadNotifications
    };
};

module.exports = {
    getNotifications,
    getNumberOfUnreadNotifications
};
