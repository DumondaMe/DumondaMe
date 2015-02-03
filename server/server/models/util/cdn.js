'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdnhost = require('./../../../common/src/lib/cdn');
var crypto = require('./../../../common/src/lib/crypto');

var password = 'd6F3Efeq';

module.exports = {
    getUrl: function (path, expires) {
        path = crypto.encrypt(path, password);
        expires = crypto.encrypt(expires.toString(), password);
        return cdnhost.getConfig().host + '?path=' + path + '&expires=' + expires;
    }
};
