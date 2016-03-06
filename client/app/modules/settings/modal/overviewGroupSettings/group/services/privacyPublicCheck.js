'use strict';

module.exports = [
    function () {

        this.isPublic = function (settings) {
            var isPublic = true;
            angular.forEach(settings, function (setting) {
                if (!setting) {
                    isPublic = false;
                }
            });
            return isPublic;
        };
    }]
;
