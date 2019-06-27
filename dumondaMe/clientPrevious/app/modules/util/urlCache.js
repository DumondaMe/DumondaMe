'use strict';

module.exports = ['$log', function ($log) {

    var cache = {};

    this.reset = function () {
        cache = {};
    };

    this.cacheUrl = function (url) {
        var index, key;
        if (angular.isString(url)) {
            index = url.indexOf(".jpg?");
            if (index !== -1) {
                key = url.substring(0, index);
                if (cache[key]) {
                    return cache[key];
                } else {
                    cache[key] = url;
                    return url;
                }
            }
            $log.warn("Nor jpg found for url " + url);
            return url;
        }
        return url;
    };
}];
