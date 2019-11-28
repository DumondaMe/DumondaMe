const ejs = require("ejs");
const slug = require('limax');
const i18next = require('i18next');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);


const getPreviewOfNotification = async function (notifications, language) {
    let preview = '<table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;' +
        'vertical-align:top;font-weight:400;width:100%">';
    for (let notification of notifications) {
        if (notification.notification && notification.notification.type === 'newQuestion') {
            try {
                let question = notification.notificationObjects[0];
                let questionCreator = notification.originators[0];
                let linkToCreator = `${process.env.DUMONDA_ME_DOMAIN}user/${questionCreator.userId}/` +
                    `${slug(questionCreator.name)}`;
                let linkToQuestion = `${process.env.DUMONDA_ME_DOMAIN}question/${question.questionId}/` +
                    `${slug(question.question)}`;
                preview += await ejs.renderFile(`${__dirname}/emailTemplates/newQuestion.ejs`, {
                    question, questionCreator, linkToCreator, linkToQuestion,
                    text1: i18next.t('notification:newQuestion.text1', {lng: language}),
                    text2: i18next.t('notification:newQuestion.text2', {lng: language})
                }, {async: true});
            } catch (error) {
                logger.error(error);
            }
        }
    }
    preview += '</table>';
    return preview;
};


module.exports = {
    getPreviewOfNotification
};
