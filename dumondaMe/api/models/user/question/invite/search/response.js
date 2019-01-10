'use strict';

const cdn = require('dumonda-me-server-lib').cdn;

const checkSendingEmailAllowed = function (user) {
    return !user.hasAlreadyAsked && user.user.disableInviteAnswerQuestionNotification !== true &&
        user.userLabels.includes('EMailNotificationEnabled') && (user.user.privacyMode !== 'onlyContact' ||
            (user.user.privacyMode === 'onlyContact' && user.userTrustLoggedInUser))
};

const checkNotLoggedInUser = function (user, userId) {
    return user.user.userId !== userId;
};

const getResponse = async function (users, userId) {
    let response = [];
    for (let user of users) {
        let userResponse = {
            sendingEmailAllowed: checkSendingEmailAllowed(user) && checkNotLoggedInUser(user, userId),
            userId: user.user.userId,
            name: user.user.name,
            isTrustUser: user.isTrustUser
        };
        if (user.user.privacyMode === 'onlyContact' && !user.userTrustLoggedInUser) {
            userResponse.userImage = await cdn.getSignedUrl(`profileImage/default/profilePreview.jpg`);
        } else {
            userResponse.userImage = await cdn.getSignedUrl(`profileImage/${user.user.userId}/profilePreview.jpg`);
        }
        response.push(userResponse);
    }
    return response;
};

const getEmailResponse = async function (users, email) {
    let user = {
        email: email, sendingEmailAllowed: true
    };

    if (users && users.length === 1) {
        user.sendingEmailAllowed = checkSendingEmailAllowed(users[0]);
    }

    return [user];
};

module.exports = {
    getResponse,
    getEmailResponse
};
