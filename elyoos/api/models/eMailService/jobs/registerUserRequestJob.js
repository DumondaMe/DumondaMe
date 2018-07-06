"use strict";

let email = require('elyoos-server-lib').eMail;

let processDefinition = async function (data, done) {
    await email.sendEMail("registerUserRequest",
        {link: `${process.env.ELYOOS_DOMAIN}register/verify/${data.linkId}`}, data.email);
    done();
};

module.exports = {
    processDefinition
};
