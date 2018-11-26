'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;

let getUserImage = async function (userId) {

    let resp = await db.cypher().match(`(u:User {userId: {userId}})`)
        .return(`u.userId AS userId`)
        .end({userId}).send();
    return {profileImage: await cdn.getSignedUrl(`profileImage/${resp[0].userId}/profile.jpg`)}
};

module.exports = {
    getUserImage
};
