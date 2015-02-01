'use strict';

var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdnhost = require('./../../lib/cdn');
var path = require('path');

module.exports = {
    getUrl: function (path, expires) {
        return cdnhost.getConfig().host + '?path=' + path + '&expires=' + expires;
    }
};