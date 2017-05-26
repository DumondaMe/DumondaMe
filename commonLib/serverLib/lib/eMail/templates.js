'use strict';

let path = require('path');
let EmailTemplate = require('email-templates').EmailTemplate;
let templatesDir = path.resolve(__dirname, 'templates');
let preProcessingInvitePerson = require('./templates/invitePerson/preProcessing');
let preProcessingFeedbackNewComment = require('./templates/feedbackNewComment/preProcessing');
let preProcessingFeedbackStatusChanged = require('./templates/feedbackStatusChanged/preProcessing');
let preProcessingNews = require('./templates/sendNews/preProcessing');
let emailTemplates = {
    newMessages: {
        template: new EmailTemplate(path.join(templatesDir, 'newMessages')),
        subject: 'Du hast neue Nachrichten',
        attachments: []
    },
    resetPassword: {
        template: new EmailTemplate(path.join(templatesDir, 'resetPassword')),
        subject: 'Passwort zurücksetzen',
        attachments: []
    },
    registerUserRequest: {
        template: new EmailTemplate(path.join(templatesDir, 'registerUserRequest')),
        subject: 'Willkommen auf Elyoos',
        attachments: []
    },
    invitePerson: {
        template: new EmailTemplate(path.join(templatesDir, 'invitePerson')),
        preProcessing: preProcessingInvitePerson.preProcessing,
        attachments: []
    },
    feedbackNewComment: {
        template: new EmailTemplate(path.join(templatesDir, 'feedbackNewComment')),
        preProcessing: preProcessingFeedbackNewComment.preProcessing,
        attachments: []
    },
    feedbackStatusChanged: {
        template: new EmailTemplate(path.join(templatesDir, 'feedbackStatusChanged')),
        preProcessing: preProcessingFeedbackStatusChanged.preProcessing,
        attachments: []
    },
    sendNews: {
        template: new EmailTemplate(path.join(templatesDir, 'sendNews')),
        preProcessing: preProcessingNews.preProcessing,
        attachments: []
    }
};

module.exports = {
    emailTemplates: emailTemplates
};
