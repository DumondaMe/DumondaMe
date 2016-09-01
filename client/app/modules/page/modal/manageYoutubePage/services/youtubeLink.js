'use strict';

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isValidYoutubeLink = function (link) {
            var isValidLink = false;
            if (angular.isString(link)) {
                if (link.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                    isValidLink = true;
                }
            }
            return isValidLink;
        };

        ctrl.getYoutubeLink = function (link) {
            var appendixLinkList;
            if (ctrl.isValidYoutubeLink(link)) {
                if (link.indexOf('&list=') !== -1) {
                    appendixLinkList = link.replace('https://www.youtube.com/watch?v=', '').split('&');
                    link = 'https://www.youtube.com/embed/' + appendixLinkList[0] + '?' + appendixLinkList[1];
                } else {
                    link = link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
                }
            }
            return link;
        };
    }];
