'use strict';

let path = require('path');
let nodemailer = require('nodemailer');
let EmailTemplate = require('email-templates').EmailTemplate;
let sesTransport = require('nodemailer-ses-transport');
let transporter = nodemailer.createTransport(sesTransport({rateLimit: 2, region: 'eu-west-1'}));
let logger = require('../logging').getLogger(__filename);

let templatesDir = path.resolve(__dirname, 'templates');
let emailTemplates = {
    newMessages: {
        template: new EmailTemplate(path.join(templatesDir, 'newMessages')),
        subject: 'Du hast neue Nachrichten',
        attachments: [{filename: 'logo.png', path: path.join(templatesDir, 'images'), cid: 'logoImage'}]
    },
    resetPassword: {
        template: new EmailTemplate(path.join(templatesDir, 'resetPassword')),
        subject: 'Passwort zurücksetzen'
    },
    registerUserRequest: {
        template: new EmailTemplate(path.join(templatesDir, 'registerUserRequest')),
        subject: 'Willkommen auf Elyoos'
    }
};


let sendEMail = function (template, templateData, sendTo) {
    if (emailTemplates.hasOwnProperty(template)) {
        emailTemplates[template].template.render(templateData, function (error, results) {
            if (error) {
                return logger.error(error);
            }
            transporter.sendMail({
                    from: 'Elyoos <info@elyoos.org>', to: sendTo, subject: emailTemplates[template].subject,
                    text: results.text, html: results.html, attachments: emailTemplates[template].attachments
                },
                function (errorSendMail) {
                    if (errorSendMail) {
                        return logger.error(errorSendMail);
                    }
                    logger.info('Email sent to: ' + sendTo);
                });
        });
    } else {
        logger.error("Message could not be sent. Template does not exist: " + template);
    }
};

module.exports = {
    sendEMail: sendEMail
};
