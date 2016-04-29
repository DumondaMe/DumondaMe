'use strict';

var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(sesTransport({rateLimit: 5, region: 'eu-west-1'}));
var logger = requireLogger.getLogger(__filename);


var sendEMail = function (template, templateData, sendTo) {
    transporter.sendMail({from: 'info@elyoos.com', to: sendTo, subject: 'Test', text: 'Hello World', html: '<b>Hello world </b>'},
        function (error) {
            if (error) {
                return logger.error(error);
            }
            logger.info('Email sent to: ' + sendTo);
        });
};

module.exports = {
    sendEMail: sendEMail
};
