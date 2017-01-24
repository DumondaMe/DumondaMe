'use strict';

let nodemailer = require('nodemailer');
let _ = require('lodash');
let sesTransport = require('nodemailer-ses-transport');
let transporter = nodemailer.createTransport(sesTransport({rateLimit: 2, region: 'eu-west-1'}));
let logger = require('../logging').getLogger(__filename);

let emailTemplates = require('./templates').emailTemplates;

let closeTempFiles = function(files) {
    if(_.isArray(files)) {
        files.forEach(function (file) {
            file.removeCallback();
        });
    }
};

let sendEMail = function (template, templateData, sendTo) {
    if (emailTemplates.hasOwnProperty(template)) {
        let attachments = emailTemplates[template].attachments, subject = emailTemplates[template].subject, tempFiles = null;

        if (emailTemplates[template].hasOwnProperty('preProcessing')) {
            let preProcessingResults = emailTemplates[template].preProcessing(templateData, emailTemplates[template].attachments);
            attachments = preProcessingResults.attachments;
            subject = preProcessingResults.subject;
            tempFiles = preProcessingResults.tempFiles;
        }
        emailTemplates[template].template.render(templateData, function (error, results) {
            if (error) {
                closeTempFiles(tempFiles);
                return logger.error(error);
            }
            transporter.sendMail({
                    from: 'Elyoos <info@elyoos.org>', to: sendTo, subject: subject,
                    text: results.text, html: results.html, attachments: attachments
                },
                function (errorSendMail) {
                    closeTempFiles(tempFiles);
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
