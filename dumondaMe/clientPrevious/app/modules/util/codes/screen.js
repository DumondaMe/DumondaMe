'use strict';

var screens = [{description: 'Desktop', code: 'desktop'},
    {description: 'Tablet', code: 'tablet'},
    {description: 'Smartphone', code: 'mobile'},
    {description: 'Alle', code: 'all'}];

module.exports = function () {

    this.screens = screens;

    this.getScreenDescription = function (code) {
        var result = null;
        angular.forEach(screens, function (screenCode) {
            if (screenCode.code === code) {
                result = screenCode.description;
            }
        });
        return result;
    };
};
