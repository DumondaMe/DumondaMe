'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isYoutubeLink = function (link) {
            var isYoutubeLink = false;
            if (angular.isString(link)) {
                if (link.indexOf('youtube.com') !== -1) {
                    isYoutubeLink = true;
                }
            }
            return isYoutubeLink;
        };
    }];
