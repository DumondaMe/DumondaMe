'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

const getUserResponse = async function (users) {
    for (let user of users) {
        user.slug = slug(user.name);
        user.profileUrl = await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
    }
    return users;
};

module.exports = {
    getUserResponse
};
