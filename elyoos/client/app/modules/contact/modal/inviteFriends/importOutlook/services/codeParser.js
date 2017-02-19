'use strict';

module.exports = [function () {

    this.parseOutlookUrl = function (url) {
        return url.substr(url.indexOf('?code=') + 6);
    };

}];
