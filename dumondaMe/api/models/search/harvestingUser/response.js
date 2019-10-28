'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

const getResponse = async function (users, userId) {
    let response = [];
    for (let user of users) {
        let userResponse = {
            userId: user.user.userId,
            name: user.user.name,
            description: user.user.userDescription,
            start: user.user.start,
            end: user.user.end,
            slug: slug(user.user.name),
            userImage: await cdn.getSignedUrl(`profileImage/${user.user.userId}/profilePreview.jpg`),
            isLoggedInUser: user.user.userId === userId
        };
        response.push(userResponse);
    }
    return response;
};

module.exports = {
    getResponse
};
