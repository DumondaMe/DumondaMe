const ejs = require("ejs");
const slug = require('limax');
const i18next = require('i18next');

const getNewQuestionPreview = async function (notification, language) {
    if (notification.notification && notification.notification.type === 'newQuestion') {
        let question = notification.notificationObjects[0];
        let questionCreator = notification.originators[0];
        let linkToCreator = `${process.env.DUMONDA_ME_DOMAIN}user/${questionCreator.userId}/` +
            `${slug(questionCreator.name)}`;
        let linkToQuestion = `${process.env.DUMONDA_ME_DOMAIN}question/${question.questionId}/` +
            `${slug(question.question)}`;
        return ejs.renderFile(`${__dirname}/emailTemplates/newQuestion.ejs`, {
            question, questionCreator, linkToCreator, linkToQuestion,
            text1: i18next.t('notification:newQuestion.text1', {lng: language}),
            text2: i18next.t('notification:newQuestion.text2', {lng: language})
        }, {async: true});
    }
    return '';
};

const getAddedToTrustCirclePreview = async function (notification, language) {
    if (notification.notification && notification.notification.type === 'addedToTrustCircle') {
        let user = notification.originators[0];
        let linkToUser = `${process.env.DUMONDA_ME_DOMAIN}user/${user.userId}/` +
            `${slug(user.name)}`;
        return ejs.renderFile(`${__dirname}/emailTemplates/addedToTrustCircle.ejs`, {
            linkToUser, user, text1: i18next.t('notification:addedToTrustCircle.text1', {lng: language})
        }, {async: true});
    }
    return '';
};

const getPreviewOfNotification = async function (notifications, language) {
    let preview = '<table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;' +
        'vertical-align:top;font-weight:400;width:100%">';
    for (let notification of notifications) {
        preview += await getNewQuestionPreview(notification, language);
        preview += await getAddedToTrustCirclePreview(notification, language);

    }
    preview += '</table>';
    return preview;
};


module.exports = {
    getPreviewOfNotification
};
