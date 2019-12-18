'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

const getUsersResponse = async function (dbUsers, userId) {
    let users = [];
    for (let dbUser of dbUsers) {
        users.push({
            userId: dbUser.userId,
            name: dbUser.name,
            isLoggedInUser: dbUser.userId === userId,
            slug: slug(dbUser.name),
            profileUrl: await cdn.getSignedUrl(`profileImage/${dbUser.userId}/thumbnail.jpg`)
        })
    }
    return users;
};

module.exports = {
    getUsersResponse
};
