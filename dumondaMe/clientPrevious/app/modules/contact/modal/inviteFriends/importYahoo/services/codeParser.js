'use strict';

module.exports = [function () {

    this.parseUrl = function (url) {
        return url.substr(url.indexOf('?code=') + 6);
    };

}];
