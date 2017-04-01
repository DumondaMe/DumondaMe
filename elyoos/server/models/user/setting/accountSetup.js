'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

let accountSetupFinished = function (id) {
    return db.cypher().match('(u:User {userId: {id}})')
        .set('u', {lastSetupAccount: time.getNowUtcTimestamp()})
        .end({id: id}).send();
};

module.exports = {
    accountSetupFinished: accountSetupFinished
};
