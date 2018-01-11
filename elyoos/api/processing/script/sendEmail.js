'use strict';

let email = require('elyoos-server-lib').eMail;
let cdnConfig = require('elyoos-server-lib').cdnConfig;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let sendEmail = function () {
    cdnConfig.config({bucket: 'elyoos.test'});
    email.sendEMail("invitePerson", {name: 'Roger Waldvogel', userId: '0'},
        'climberwoodi@gmx.ch');
    logger.info('Sent email');
};

module.exports = {
    sendEmail: sendEmail
};
