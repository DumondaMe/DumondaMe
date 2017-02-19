'use strict';

module.exports = [function () {

    this.parseYahooUrl = function (url) {
        return url.substr(url.indexOf('?code=') + 6);
    };

}];
