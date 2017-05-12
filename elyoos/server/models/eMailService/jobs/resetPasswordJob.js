"use strict";

let email = require('elyoos-server-lib').eMail;
let domainService = require('elyoos-server-lib').domain;

let domain = domainService.getDomain();

let processDefinition = function (data, done) {

    email.sendEMail("resetPassword", {link: `${domain}password/reset/${data.linkId}`}, data.email);
    return done();
};

module.exports = {
    processDefinition: processDefinition
};
