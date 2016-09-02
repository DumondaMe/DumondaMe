'use strict';

var getListElement = function (appendix) {
    var result = '';
    angular.forEach(appendix, function (appendixElement) {
        if(appendixElement.indexOf('list=') !== -1) {
            result = appendixElement;
        }
    });
    return result;
};

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
                    link = 'https://www.youtube.com/embed/' + appendixLinkList[0] + '?' + getListElement(appendixLinkList);
                } else {
                    link = link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
                }
            }
            return link;
        };
    }];
