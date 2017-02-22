'use strict';

module.exports = [function () {

    this.parseUrl = function (url) {
        var token = url.substr(url.indexOf('?code=') + 6);
        return token.substr(0, token.length - 1);
    };

}];
