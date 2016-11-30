'use strict';

var db = requireDb();
var passwordEncryption = requireLib('passwordEncryption');
var exceptions = requireLib('error/exceptions');
var logger = requireLogger.getLogger(__filename);

var checkActualPassword = function (userId, actualPassword, req) {

    return db.cypher().match('(u:User {userId: {userId}})')
        .return('u.password AS password')
        .end({userId: userId})
        .send()
        .then(function (user) {
            return passwordEncryption.comparePassword(actualPassword, user[0].password);
        })
        .then(function (samePassword) {
            if (!samePassword) {
                return exceptions.getInvalidOperation('Wrong actual password for changing password', logger, req);
            }
        });
};

var changePassword = function (userId, newPassword, actualPassword, req) {
    return checkActualPassword(userId, actualPassword, req)
        .then(function () {
            return passwordEncryption.generatePasswordHash(newPassword);
        })
        .then(function (hash) {
            return db.cypher().match('(u:User {userId: {userId}})')
                .set('u', {password: hash})
                .end({userId: userId})
                .send();
        });
};

module.exports = {
    changePassword: changePassword
};
