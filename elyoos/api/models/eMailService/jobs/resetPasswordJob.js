"use strict";

let email = require('elyoos-server-lib').eMail;

let processDefinition = async function (data, done) {

    await email.sendEMail("resetPassword", {link: `${process.env.ELYOOS_DOMAIN}login/passwordReset?linkId=${data.linkId}`}, data.email);
    return done();
};

module.exports = {
    processDefinition
};
