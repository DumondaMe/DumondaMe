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
            slug: slug(user.user.name),
            userImage: await cdn.getSignedUrl(`profileImage/${user.user.userId}/profilePreview.jpg`),
            isLoggedInUser: user.user.userId === userId,
            isTrustUser: user.isTrustUser
        };
        response.push(userResponse);
    }
    return response;
};

module.exports = {
    getResponse
};
