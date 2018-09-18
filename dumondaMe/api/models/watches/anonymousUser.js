'use strict';

const cdn = require('dumonda-me-server-lib').cdn;

const addAnonymousUser = async function (users, numberOfWatches, hasMoreUsers, numberOfSkipUsers) {
    if (numberOfWatches > 0 && !hasMoreUsers && users.length + numberOfSkipUsers < numberOfWatches) {
        users.push({
            isAnonymous: true,
            profileUrl: await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`),
            numberOfAnonymous: numberOfWatches - users.length - numberOfSkipUsers
        });
    }
};

module.exports = {
    addAnonymousUser
};
