'use strict';

var getListElement = function (appendix) {
    var result = '';
    angular.forEach(appendix, function (appendixElement) {
        if (appendixElement.indexOf('list=') !== -1) {
            result = appendixElement;
        }
    });
    return result;
};

var getIdElement = function (appendix) {
    var result = '';
    angular.forEach(appendix, function (appendixElement) {
        if (appendixElement.indexOf('v=') !== -1) {
            result = appendixElement.replace('v=', '');
        }
    });
    return result;
};

var getBaseUrl = function (link) {
    if (link.indexOf('https://www.youtube.com/watch?v=') !== -1 && link.indexOf('list=') < 0) {
        return 'https://www.youtube.com/watch?v=';
    } else if(link.indexOf('https://www.youtube.com/watch?') !== -1) {
        return 'https://www.youtube.com/watch?';
    } else if(link.indexOf('https://m.youtube.com/watch?v=') !== -1 && link.indexOf('list=') < 0) {
        return 'https://m.youtube.com/watch?v=';
    } else if(link.indexOf('https://m.youtube.com/watch?') !== -1) {
        return 'https://m.youtube.com/watch?';
    }
    return '';
};

module.exports = [
    function () {
        var ctrl = this;

        ctrl.isValidYoutubeLink = function (link) {
            var isValidLink = false;
            if (angular.isString(link)) {
                if (link.indexOf('https://www.youtube.com/watch?') !== -1 || link.indexOf('https://m.youtube.com/watch?') !== -1) {
                    isValidLink = true;
                }
            }
            return isValidLink;
        };

        ctrl.getYoutubeLink = function (link) {
            var appendixLinkList, baseUrl, result = null;
            if (ctrl.isValidYoutubeLink(link)) {
                baseUrl = getBaseUrl(link);
                if (link.indexOf('list=') !== -1) {
                    appendixLinkList = link.replace(baseUrl, '').split('&');
                    result = 'https://www.youtube.com/embed/' + getIdElement(appendixLinkList) + '?' + getListElement(appendixLinkList);
                } else {
                    result = link.replace(baseUrl, 'https://www.youtube.com/embed/');
                }
            }
            return result;
        };
    }];
