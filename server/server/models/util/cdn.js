'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdnhost = require('./../../../common/src/lib/cdn');
var crypto = require('crypto');

var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password),
        crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

module.exports = {
    getUrl: function (path, expires) {
        path = encrypt(path);
        expires = encrypt(expires.toString());
        return cdnhost.getConfig().host + '?path=' + path + '&expires=' + expires;
    }
};
