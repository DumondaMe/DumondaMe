'use strict';

module.exports = [function () {

    this.parseGoogleUrl = function (url) {
        return url.substr(url.indexOf('?code=') + 6);
    };

}];
