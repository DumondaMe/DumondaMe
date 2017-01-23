'use strict';

let email = require('elyoos-server-lib').eMail;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let sendEmail = function () {
    email.sendEMail("registerUserRequest", {link: 'www.elyoos.org', },
        'climberwoodi@gmx.ch');
    logger.info('Sent email');
};

module.exports = {
    sendEmail: sendEmail
};
