'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;
const text = requireModel('util/text');

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

const getAdminOfCommitmentRequest = function (notification) {
    let commitment = notification.infos.find((info) => typeof info.info.commitmentId === 'string').info;
    let user = notification.originators[0].originator;
    return {
        read: notification.read,
        notificationId: notification.notification.notificationId,
        created: notification.notification.created,
        type: notification.notification.type,
        confirmToBeAdmin: notification.notification.confirmToBeAdmin || false,
        userId: user.userId,
        userName: user.name,
        userSlug: slug(user.name),
        commitmentId: commitment.commitmentId,
        commitmentTitle: commitment.title,
        commitmentSlug: slug(commitment.title)
    }
};

const getUser = async function (user, created, isContact, isHarvestingUser) {
    let isAnonymous = user.privacyMode === 'onlyContact' && !isContact && !isHarvestingUser, thumbnailUrl;
    if (isAnonymous) {
        thumbnailUrl = await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`)
    } else {
        thumbnailUrl = await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
    }
    return {
        userId: user.userId, name: user.name, slug: slug(user.name), added: created,
        thumbnailUrl, isAnonymous, isHarvestingUser
    }
};

const getNotificationWithOriginators = async function (notification) {
    let index, users = [];
    for (index = 0; index < 3 && index < notification.originators.length; index++) {
        let user = notification.originators[index].originator;
        let created = notification.originators[index].relOriginator.created;
        let isContact = notification.originators[index].isContact;
        let isHarvestingUser = notification.originators[index].isHarvestingUser;
        users.push(await getUser(user, created, isContact, isHarvestingUser));
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

const addWatchingCommitmentProperties = function (notificationResponse, notification) {
    if ((notificationResponse.type === 'watchingCommitment' || notificationResponse.type === 'newCommitment')
        && notification.infos.length === 1) {
        notificationResponse.commitmentId = notification.infos[0].info.commitmentId;
        notificationResponse.commitmentTitle = notification.infos[0].info.title;
        notificationResponse.commitmentDescription =
            text.getTruncatedText(notification.infos[0].info.description, 200);
        notificationResponse.commitmentSlug = slug(notification.infos[0].info.title);
        notificationResponse.commitmentImage =
            cdn.getPublicUrl(`commitment/${notificationResponse.commitmentId}/120x120/title.jpg`);
    }
};

const addQuestionProperties = function (notificationResponse, notification) {
    if ((notificationResponse.type === 'watchingQuestion' || notificationResponse.type === 'newQuestion') &&
        notification.infos.length === 1) {
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
            (l) => ['Youtube', 'Default', 'Link', 'Book', 'CommitmentAnswer'].some(v => v === l))[0];

        if (notificationResponse.answerType === 'CommitmentAnswer') {
            let commitment = notification.infos.find((info) => typeof info.info.commitmentId === 'string').info;
            notificationResponse.answerTitle = commitment.title;
        } else if (notificationResponse.answerType === 'Default') {
            notificationResponse.answerTitle = text.getTruncatedText(answer.info.answer, 200);
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
            (l) => ['Youtube', 'Default', 'Link', 'Book'].some(v => v === l))[0];
        notificationResponse.noteId = note.noteId;
        notificationResponse.noteText = note.text;

        if (notificationResponse.answerType === 'Default') {
            notificationResponse.answerTitle = text.getTruncatedText(answer.info.answer, 200);
        } else {
            notificationResponse.answerTitle = answer.info.title;
        }
    }
};

const getOneTime = function (notification) {
    return {
        read: notification.read,
        notificationId: notification.notification.notificationId,
        created: notification.notification.created,
        type: notification.notification.type
    }
};

const getResponse = async function (notifications) {
    let response = [];
    for (let notification of notifications) {
        if (notification.isOneTime) {
            response.push(getOneTime(notification));
        } else if (notification.notification.type === 'showQuestionRequest') {
            response.push(getShowQuestionOnCommitmentRequest(notification));
        } else if (notification.notification.type === 'requestAdminOfCommitment') {
            response.push(getAdminOfCommitmentRequest(notification));
        } else {
            let notificationResponse = await getNotificationWithOriginators(notification);
            addWatchingCommitmentProperties(notificationResponse, notification);
            addQuestionProperties(notificationResponse, notification);
            addCreatedAnswerProperties(notificationResponse, notification);
            addCreatedNoteProperties(notificationResponse, notification);
            response.push(notificationResponse);
        }
    }
    return response;
};


module.exports = {
    getResponse
};
