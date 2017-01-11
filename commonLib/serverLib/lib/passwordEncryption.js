'use strict';

let bcrypt = require('bcrypt');
let Promise = require('bluebird');

Promise.promisifyAll(bcrypt);

let generatePasswordHash = function (password) {
    return bcrypt.genSaltAsync(10).then(function (salt) {
        return bcrypt.hashAsync(password, salt);
    });
};

let comparePassword = function (password, dbPassword) {
    return bcrypt.compareAsync(password, dbPassword);
};

module.exports = {
    generatePasswordHash: generatePasswordHash,
    comparePassword: comparePassword
};
