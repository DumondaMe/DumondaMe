'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

const ONE_DAY = 86400;

let check = function (isAuthenticated, userId) {
    if (isAuthenticated) {
        let now = time.getNowUtcTimestamp();
        return db.cypher().match('(u:User {userId: {userId}})')
            .where("u.lastLogin < {minTimeShown}")
            .addCommand("SET u.previousLastLogin = u.lastLogin")
            .set('u', {lastLogin: now})
            .end({userId: userId, minTimeShown: now - ONE_DAY}).send().then(function () {
                return {isLoggedIn: true};
            });
    }
    return Promise.resolve({isLoggedIn: false});
};

module.exports = {
    check: check
};
