"use strict";

let email = require('elyoos-server-lib').eMail;
let domainService = require('elyoos-server-lib').domain;

let domain = domainService.getDomain();

let processDefinition = function (data, done) {
    email.sendEMail("registerUserRequest",
        {link: `${domain}register/verify/${data.linkId}`}, data.email);
    done();
};

module.exports = {
    processDefinition: processDefinition
};
