"use strict";

let email = require('elyoos-server-lib').eMail;

let processDefinition = function (data, done) {

    email.sendEMail("sendNews", {
        title: data.title,
        text: data.text,
        forename: data.forename,
        unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/news/${data.email}`
    }, data.email);
    done();
};

module.exports = {
    processDefinition: processDefinition
};
