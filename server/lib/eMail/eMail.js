'use strict';

var path = require('path');
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var sesTransport = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(sesTransport({rateLimit: 2, region: 'eu-west-1'}));
var logger = requireLogger.getLogger(__filename);

var templatesDir = path.resolve(__dirname, 'templates');
var emailTemplates = {
    newMessages: {
        template: new EmailTemplate(path.join(templatesDir, 'newMessages')),
        subject: 'Du hast neue Nachrichten'
    }
};


var sendEMail = function (template, templateData, sendTo) {
    if (emailTemplates.hasOwnProperty(template)) {
        emailTemplates[template].template.render(templateData, function (error, results) {
            if (error) {
                return logger.error(error);
            }
            transporter.sendMail({
                    from: 'Elyoos <info@elyoos.com>', to: sendTo, subject: emailTemplates[template].subject,
                    text: results.text, html: results.html
                },
                function (error) {
                    if (error) {
                        return logger.error(error);
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
