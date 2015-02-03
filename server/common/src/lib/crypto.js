'use strict';

var crypto = require('crypto');

var algorithm = 'aes-256-ctr';

function decrypt(text, password) {
    var decipher = crypto.createDecipher(algorithm, password),
        dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function encrypt(text, password) {
    var cipher = crypto.createCipher(algorithm, password),
        crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

module.exports = {
    decrypt: decrypt,
    encrypt: encrypt
};
