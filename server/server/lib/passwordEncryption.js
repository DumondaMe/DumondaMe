'use strict';

var bcrypt = require('bcrypt');
var Promise = require('bluebird');

Promise.promisifyAll(bcrypt);

var generatePasswordHash = function (password) {
    return bcrypt.genSaltAsync(10).then(function (salt) {
        return bcrypt.hashAsync(password, salt);
    });
};

var comparePassword = function (password, dbPassword) {
    return bcrypt.compareAsync(password, dbPassword);
};

module.exports = {
    generatePasswordHash: generatePasswordHash,
    comparePassword: comparePassword
};
