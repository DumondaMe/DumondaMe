'use strict';

var mailcheck = require('mailcheck');

module.exports = function () {

    mailcheck.defaultDomains.push('gmx.ch', 'gmx.de', 'gmx.net', 'web.de', 't-online.de', 'sunrise.ch', 'bluewin.ch', 'bluemail.ch',
        'sunrise.ch', 'hispeed.ch', 'yahoo.de', 'mail.de', 'o2online.de');
    mailcheck.defaultTopLevelDomains.push('ch', 'de', 'at');
    return mailcheck;
};
