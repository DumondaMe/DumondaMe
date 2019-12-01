const i18next = require('i18next');

const getUserName = function (user, language) {
    let userName = user.originator.name;
    if (isAnonymous(user)) {
        userName = i18next.t('notification:common.anonymousPerson', {lng: language});
    }
    return userName;
};

const isAnonymous = function (user) {
    return user.originator.privacyMode === 'onlyContact' && !user.isContact;
};

module.exports = {
    getUserName,
    isAnonymous
};
