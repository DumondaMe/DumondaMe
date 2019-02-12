'use strict';

const user = require('./user');


const addMetaData = async function (userId, emails) {
    emails = emails.map(function (email) {
        return {email}
    });
    return {contacts: await user.getUserInfo(emails, userId)};
};

module.exports = {
    addMetaData
};
