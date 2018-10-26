'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

const getResponse = async function (users, userId) {
    let response = [];
    for (let user of users) {
        let userResponse = {
            isAnonymous: false,
            userId: user.user.userId,
            name: user.user.name,
            isLoggedInUser: user.user.userId === userId,
            isTrustUser: user.isTrustUser
        };
        if (user.user.privacyMode === 'onlyContact' && !user.userTrustLoggedInUser) {
            userResponse.isAnonymous = true;
            userResponse.userImage = await cdn.getSignedUrl(`profileImage/default/profilePreview.jpg`);
        } else {
            userResponse.slug = slug(user.user.name);
            userResponse.userImage = await cdn.getSignedUrl(`profileImage/${user.user.userId}/profilePreview.jpg`);
        }
        response.push(userResponse);
    }
    return response;
};

module.exports = {
    getResponse
};
