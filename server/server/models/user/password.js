'use strict';

var db = require('./../../neo4j');
var passwordEncryption = require('./../../lib/passwordEncryption');
var logger = requireLogger.getLogger(__filename);

var changePassword = function (userId, newPassword) {
    return passwordEncryption.generatePasswordHash(newPassword)
        .then(function (hash) {
            return db.cypher().match('(u:User {userId: {userId}})')
                .set('u', {password: hash})
                .end({userId: userId, password: hash})
                .send();
        });
};

module.exports = {
    changePassword: changePassword
};
