"use strict";

const eMail = require('dumonda-me-server-lib').eMail;

const sendRegisterUserVerification = async function (linkId, language, sendTo) {
    await eMail.sendEMail('registerUserRequest',
        {link: `${process.env.DUMONDA_ME_DOMAIN}register/verify/${linkId}`}, language, sendTo);
};

module.exports = {
    sendRegisterUserVerification
};
