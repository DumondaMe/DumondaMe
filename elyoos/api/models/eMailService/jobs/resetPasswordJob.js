"use strict";

let email = require('elyoos-server-lib').eMail;

let processDefinition = function (data, done) {

    email.sendEMail("resetPassword", {link: `${process.env.ELYOOS_DOMAIN}password/reset/${data.linkId}`}, data.email);
    return done();
};

module.exports = {
    processDefinition: processDefinition
};
