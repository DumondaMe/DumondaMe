'use strict';

var crypto = require('crypto');

var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password),
        dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    decrypt: decrypt
};
