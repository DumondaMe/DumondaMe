"use strict";

let email = require('elyoos-server-lib').eMail;
let domain = require('elyoos-server-lib').domain;

let processDefinition = function (data, done) {

    email.sendEMail("sendNews", {
        title: data.title,
        text: data.text,
        forename: data.forename,
        unsubscribeLink: `${domain.getDomain()}unsubscribe/news/${data.email}`
    }, data.email);
    done();
};

module.exports = {
    processDefinition: processDefinition
};
