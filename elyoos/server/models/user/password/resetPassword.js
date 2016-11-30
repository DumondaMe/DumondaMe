'use strict';

var db = requireDb();
var passwordEncryption = requireLib('passwordEncryption');
var exceptions = requireLib('error/exceptions');
var logger = requireLogger.getLogger(__filename);
var time = requireLib('time');

var checkLinkValid = function (linkId, req) {

    return db.cypher().match('(u:User {resetPasswordLinkId: {resetPasswordLinkId}})')
        .return('u.resetPasswordRequestTimeout AS expires').end({resetPasswordLinkId: linkId}).send()
        .then(function (user) {
            if (user.length === 1 && user[0].expires > time.getNowUtcTimestamp()) {
                return;
            }
            return exceptions.getInvalidOperation(`Invalid Link ${linkId}`, logger, req);
        });
};

var resetPassword = function (linkId, newPassword, req) {
    return checkLinkValid(linkId, req)
        .then(function () {
            return passwordEncryption.generatePasswordHash(newPassword);
        }).then(function (hash) {
            return db.cypher().match('(u:User {resetPasswordLinkId: {resetPasswordLinkId}})')
                .set('u', {password: hash}).remove("u.resetPasswordLinkId").end({resetPasswordLinkId: linkId}).send();
        });
};

module.exports = {
    resetPassword: resetPassword
};
