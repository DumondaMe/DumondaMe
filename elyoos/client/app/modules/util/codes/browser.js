'use strict';

var browsers = [{description: 'Internet Explorer (Edge)', code: 'ie'},
    {description: 'Firefox', code: 'firefox'},
    {description: 'Chrome', code: 'chrome'},
    {description: 'Safari', code: 'safari'},
    {description: 'Anderer', code: 'other'}];

module.exports = function () {

    this.browsers = browsers;

    this.getBrowserDescription = function (code) {
        var result = null;
        angular.forEach(browsers, function (browserCode) {
            if (browserCode.code === code) {
                result = browserCode.description;
            }
        });
        return result;
    };
};
