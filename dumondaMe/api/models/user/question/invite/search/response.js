'use strict';

const checkIsRegisteredUser = function (dbUser) {
    return dbUser.userLabels.includes('User');
};

const checkIsUnsubscribed = function (dbUser) {
    return !dbUser.userLabels.includes('EMailNotificationEnabled');
};

const getResponse = function (dbUser, email) {
    let user = {
        email: email, isRegisteredUser: false, alreadySent: false, unsubscribed: false
    };

    if (dbUser && dbUser.length === 1) {
        user.isRegisteredUser = checkIsRegisteredUser(dbUser[0]);
        user.alreadySent = dbUser[0].hasAlreadyAsked;
        user.unsubscribed = checkIsUnsubscribed(dbUser[0]);
    }

    return user;
};

module.exports = {
    getResponse
};
