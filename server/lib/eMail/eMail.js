'use strict';

var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(sesTransport({rateLimit: 5}));
var logger = requireLogger.getLogger(__filename);


var sendEMail = function (template, templateData, sendTo) {

};

module.exports = {
    sendEMail: sendEMail
};
