'use strict';

let nodemailer = require('nodemailer');
let sesTransport = require('nodemailer-ses-transport');
let transporter = nodemailer.createTransport(sesTransport({rateLimit: 2, region: 'eu-west-1'}));
let logger = require('../logging').getLogger(__filename);

let emailTemplates = require('./templates').emailTemplates;

let sendEMail = function (template, templateData, sendTo) {
    if (emailTemplates.hasOwnProperty(template)) {
        let attachments = emailTemplates[template].attachments;
        let subject = emailTemplates[template].subject;

        if (emailTemplates[template].hasOwnProperty('preProcessing')) {
            let preProcessingResults = emailTemplates[template].preProcessing(templateData, emailTemplates[template].attachments,
                emailTemplates[template].subject);
            attachments = preProcessingResults.attachments;
            subject = preProcessingResults.subject;
        }
        emailTemplates[template].template.render(templateData, function (error, results) {
            if (error) {
                return logger.error(error);
            }
            transporter.sendMail({
                    from: 'Elyoos <info@elyoos.org>', to: sendTo, subject: subject,
                    text: results.text, html: results.html, attachments: attachments
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
