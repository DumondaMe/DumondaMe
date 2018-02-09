"use strict";

let email = require('elyoos-server-lib').eMail;

let processDefinition = function (data, done) {
    email.sendEMail("registerUserRequest",
        {link: `${process.env.ELYOOS_DOMAIN}register/verify/${data.linkId}`}, data.email);
    done();
};

module.exports = {
    processDefinition: processDefinition
};
