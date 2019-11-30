const ejs = require("ejs");
const slug = require('limax');
const i18next = require('i18next');
const user = require('../user');

const createdAnswer = async function (notification, language) {
    let question = notification.notificationObjects.find((n) => typeof n.questionId === 'string');
    let answer = notification.notificationObjects.find((n) => typeof n.answerId === 'string');
    let answerCreator = notification.originators[0].originator;
    let linkToCreator = `${process.env.DUMONDA_ME_DOMAIN}user/${answerCreator.userId}/` +
        `${slug(answerCreator.name)}`;
    let linkToAnswer = `${process.env.DUMONDA_ME_DOMAIN}question/${question.questionId}/` +
        `${slug(question.question)}?answerId=${answer.answerId}`;
    let descriptionAnswer = '';
    if (typeof answer.answer === 'string') {
        descriptionAnswer = answer.answer.length < 200 ? answer.answer : answer.answer.substring(0, 200) + '...';
    } else if (typeof answer.description === 'string') {
        descriptionAnswer = answer.description.length < 200 ? answer.description :
            answer.description.substring(0, 200) + '...';
    }
    return ejs.renderFile(`${__dirname}/../emailTemplates/createdAnswer.ejs`, {
        answer, question, answerCreator, linkToCreator, linkToAnswer, descriptionAnswer,
        isAnonymous: user.isAnonymous(notification.originators[0]),
        text1: i18next.t('notification:createdAnswer.text1', {lng: language, question: question.question}),
        text2: i18next.t('notification:createdAnswer.text2', {lng: language}),
        textDefaultAnswer1: i18next.t('notification:createdAnswer.textDefaultAnswer1', {lng: language}),
        textDefaultAnswer2: i18next.t('notification:createdAnswer.textDefaultAnswer2', {lng: language}),
        anonymousPerson: i18next.t('notification:common.anonymousPerson', {lng: language})
    }, {async: true});
};

const newQuestion = async function (notification, language) {
    let question = notification.notificationObjects[0];
    let questionCreator = notification.originators[0].originator;
    let linkToCreator = `${process.env.DUMONDA_ME_DOMAIN}user/${questionCreator.userId}/` +
        `${slug(questionCreator.name)}`;
    let linkToQuestion = `${process.env.DUMONDA_ME_DOMAIN}question/${question.questionId}/` +
        `${slug(question.question)}`;
    return ejs.renderFile(`${__dirname}/../emailTemplates/newQuestion.ejs`, {
        question, questionCreator, linkToCreator, linkToQuestion,
        text1: i18next.t('notification:newQuestion.text1', {lng: language}),
        text2: i18next.t('notification:newQuestion.text2', {lng: language})
    }, {async: true});
};

const addedToTrustCircle = async function (notification, language) {
    let user = notification.originators[0].originator;
    let linkToUser = `${process.env.DUMONDA_ME_DOMAIN}user/${user.userId}/` +
        `${slug(user.name)}`;
    return ejs.renderFile(`${__dirname}/../emailTemplates/addedToTrustCircle.ejs`, {
        linkToUser, user, text1: i18next.t('notification:addedToTrustCircle.text1', {lng: language})
    }, {async: true});
};

const requestAdminOfCommitment = async function (notification, language) {
    let commitment = notification.notificationObjects[0];
    let commitmentAdmin = notification.originators[0].originator;
    let linkToCommitmentAdmin = `${process.env.DUMONDA_ME_DOMAIN}user/${commitmentAdmin.userId}/` +
        `${slug(commitmentAdmin.name)}`;
    let linkToCommitment = `${process.env.DUMONDA_ME_DOMAIN}commitment/${commitment.commitmentId}/` +
        `${slug(commitment.title)}`;
    return ejs.renderFile(`${__dirname}/../emailTemplates/adminOfCommitmentRequest.ejs`, {
        commitment, commitmentAdmin, linkToCommitmentAdmin, linkToCommitment,
        text1: i18next.t('notification:adminOfCommitmentRequest.text1', {lng: language}),
        text2: i18next.t('notification:adminOfCommitmentRequest.text2', {lng: language})
    }, {async: true});
};

const notificationsHandler = {
    createdAnswer, newQuestion, addedToTrustCircle, requestAdminOfCommitment
};

const getPreviewOfNotification = async function (notifications, language) {
    let preview = '<table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;' +
        'vertical-align:top;font-weight:400;width:100%">';
    for (let notification of notifications) {
        if (notification.notification && typeof notification.notification.type === 'string') {
            preview += await notificationsHandler[notification.notification.type](notification, language);
        }
    }
    preview += '</table>';
    return preview;
};


module.exports = {
    getPreviewOfNotification
};
