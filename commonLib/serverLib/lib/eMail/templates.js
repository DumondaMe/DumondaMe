'use strict';

let path = require('path');
let EmailTemplate = require('email-templates').EmailTemplate;
let templatesDir = path.resolve(__dirname, 'templates');
let preProcessingInvitePerson = require('./templates/invitePerson/preProcessing');
let preProcessingFeedbackNewComment = require('./templates/feedbackNewComment/preProcessing');
let preProcessingFeedbackStatusChanged = require('./templates/feedbackStatusChanged/preProcessing');
let emailTemplates = {
    newMessages: {
        template: new EmailTemplate(path.join(templatesDir, 'newMessages')),
        subject: 'Du hast neue Nachrichten',
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images/logo.png'), cid: 'logoImage'}]
    },
    resetPassword: {
        template: new EmailTemplate(path.join(templatesDir, 'resetPassword')),
        subject: 'Passwort zurücksetzen',
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images/logo.png'), cid: 'logoImage'}]
    },
    registerUserRequest: {
        template: new EmailTemplate(path.join(templatesDir, 'registerUserRequest')),
        subject: 'Willkommen auf Elyoos',
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images/logo.png'), cid: 'logoImage'}]
    },
    invitePerson: {
        template: new EmailTemplate(path.join(templatesDir, 'invitePerson')),
        preProcessing: preProcessingInvitePerson.preProcessing,
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images/logo.png'), cid: 'logoImage'},
            {filename: 'founder.jpg', path: path.join(templatesDir, 'images/founder.jpg'), cid: 'founderImage'}]
    },
    feedbackNewComment: {
        template: new EmailTemplate(path.join(templatesDir, 'feedbackNewComment')),
        preProcessing: preProcessingFeedbackNewComment.preProcessing,
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images/logo.png'), cid: 'logoImage'}]
    },
    feedbackStatusChanged: {
        template: new EmailTemplate(path.join(templatesDir, 'feedbackStatusChanged')),
        preProcessing: preProcessingFeedbackStatusChanged.preProcessing,
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images/logo.png'), cid: 'logoImage'}]
    }
};

module.exports = {
    emailTemplates: emailTemplates
};
