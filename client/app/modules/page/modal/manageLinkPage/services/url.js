'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isValidLink = function (link) {
            var isValidLink = false;
            if (angular.isString(link)) {
                if (link.indexOf('https://www.youtube.com/embed/') !== -1 || link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                    isValidLink = true;
                }
            }
            return isValidLink;
        };
    }];
