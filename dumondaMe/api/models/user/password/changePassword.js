'use strict';

let db = requireDb();
let passwordEncryption = require('dumonda-me-server-lib').passwordEncryption;
let exceptions = require('dumonda-me-server-lib').exceptions;
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

let checkActualPassword = async function (userId, actualPassword, req) {
    let user = await db.cypher().match('(u:User {userId: {userId}})')
        .return('u.password AS password')
        .end({userId: userId}).send();

    let samePassword = await passwordEncryption.comparePassword(actualPassword, user[0].password);
    if (!samePassword) {
        return exceptions.getInvalidOperation('Wrong actual password for changing password', logger, req);
    }
};

let changePassword = async function (userId, newPassword, actualPassword, req) {
    await checkActualPassword(userId, actualPassword, req);
    let hash = await passwordEncryption.generatePasswordHash(newPassword);
    return db.cypher().match('(u:User {userId: {userId}})')
        .set('u', {password: hash})
        .end({userId: userId}).send();
};

module.exports = {
    changePassword: changePassword
};
