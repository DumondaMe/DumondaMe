'use strict';

let nodemailer = require('nodemailer');
let AWS = require('aws-sdk');
let _ = require('lodash');
let logger = require('../logging').getLogger(__filename);

if ('production' === process.env.NODE_ENV || 'development' === process.env.NODE_ENV) {
    AWS.config.credentials = new AWS.EC2MetadataCredentials({
        httpOptions: {timeout: 10000}
    });
}
AWS.config.region = process.env.AWS_REGION_EMAIL;

let transporter = nodemailer.createTransport({
    SES: new AWS.SES({apiVersion: '2010-12-01'}), sendingRate: 8
});

let emailTemplates = require('./templates');

let closeTempFiles = function (files) {
    if (_.isArray(files)) {
        for (let file of files) {
            file.removeCallback();
        }
    }
};

let sendEMail = async function (template, templateData, language, sendTo) {

    let renderResult;
    try {
        renderResult = await emailTemplates.renderTemplate(template, templateData, language);
        let response = await transporter.sendMail({
            from: 'Elyoos <info@elyoos.org>', to: sendTo,
            subject: renderResult.subject, html: renderResult.html, attachments: renderResult.attachments
        });
        if (response.err) {
            logger.error(`Email could not be sent to ${sendTo}`);
        } else {
            logger.info(`EMail (${template}) sent to ${sendTo}`);
        }
    } finally {
        if (renderResult) {
            closeTempFiles(renderResult.tempFiles);
        }
    }
};

module.exports = {
    sendEMail
};
