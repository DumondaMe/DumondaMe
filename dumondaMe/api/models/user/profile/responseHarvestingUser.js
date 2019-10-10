/**
 * A model for the user
 */
'use strict';

const cdn = require('dumonda-me-server-lib').cdn;

let getUserProfileResponse = async function (userId, userIdOfProfile, profile, feed) {

    profile.profileImage = await cdn.getSignedUrl(`profileImage/${userIdOfProfile}/profile.jpg`);
    profile.isLoggedInUser = userId === userIdOfProfile;

    profile.feed = feed;
    return profile;
};

module.exports = {
    getUserProfileResponse
};
