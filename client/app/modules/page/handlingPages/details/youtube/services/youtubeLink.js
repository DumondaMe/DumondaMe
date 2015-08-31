'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isValidYoutubeLink = function (link) {
            var isValidLink = false;
            if (angular.isString(link)) {
                if (link.indexOf('https://www.youtube.com/embed/') !== -1 || link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                    isValidLink = true;
                }
            }
            return isValidLink;
        };

        ctrl.getYoutubeLink = function (link) {
            if(ctrl.isValidYoutubeLink(link)) {
                if (link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                    link = link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
                }
            }
            return link;
        };
    }];
