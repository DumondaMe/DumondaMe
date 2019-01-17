'use strict';

let path = require('path');
let fs = require('fs');
let EmailTemplate = require('email-templates');

let emailTemplate = new EmailTemplate({
    views: {
        root: path.resolve(__dirname, 'templates'),
        options: {
            extension: 'nunjucks'
        }
    }
});

const addSubject = function (result, template, templateData, language) {
    let subjectPath = path.join(__dirname, 'templates', template, language, 'subject.js');
    if (fs.existsSync(subjectPath)) {
        let subject = require(subjectPath);
        result.subject = subject.getSubject(templateData);
    }
};

const addAttachments = function (result, template, templateData) {
    let attachmentsPath = path.join(__dirname, 'templates', template, 'attachments.js');
    if (fs.existsSync(attachmentsPath)) {
        let attachments = require(attachmentsPath).getAttachments(templateData);
        result.attachments = attachments.attachments;
        result.tempFiles = attachments.tempFiles;
    }
};

const addEMailSender = function (result, template, templateData, language) {
    let senderPath = path.join(__dirname, 'templates', template, language, 'sender.js');
    if (fs.existsSync(senderPath)) {
        let sender = require(senderPath);
        result.senderName = sender.getSender(templateData);
    } else {
        result.senderName = 'DumondaMe';
    }
};

const renderTemplate = async function (template, templateData, language) {
    let result = {html: await emailTemplate.render(`${template}/${language}/html`, templateData)};
    addSubject(result, template, templateData, language);
    addAttachments(result, template, templateData);
    addEMailSender(result, template, templateData, language);
    return result;
};

module.exports = {
    renderTemplate
};
