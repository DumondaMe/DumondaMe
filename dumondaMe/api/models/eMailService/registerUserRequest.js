"use strict";

const eMail = require('dumonda-me-server-lib').eMail;

const sendRegisterUserVerification = async function (linkId, language, sendTo) {
    await eMail.sendEMail('registerUserRequest',
        {link: `${process.env.ELYOOS_DOMAIN}register/verify/${linkId}`}, language, sendTo);
};

module.exports = {
    sendRegisterUserVerification
};
