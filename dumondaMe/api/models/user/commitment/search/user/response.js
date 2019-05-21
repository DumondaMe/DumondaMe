'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

const getResponse = async function (users) {
    let response = [];
    for (let user of users) {
        let userResponse = {
            isAnonymous: false,
            userId: user.user.userId,
            name: user.user.name,
            isTrustUser: user.isTrustUser,
            isAdminOfCommitment: user.isAdminOfCommitment,
            isRequestAdminOfCommitmentActive: user.isRequestAdminOfCommitmentActive
        };

        userResponse.slug = slug(user.user.name);
        userResponse.userImage = await cdn.getSignedUrl(`profileImage/${user.user.userId}/profilePreview.jpg`);
        response.push(userResponse);
    }
    return response;
};

module.exports = {
    getResponse
};
