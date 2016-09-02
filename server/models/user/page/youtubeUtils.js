'use strict';

var _ = require('lodash');

var getListElement = function (appendix) {
    var result = '';
    _.forEach(appendix, function (appendixElement) {
       if(appendixElement.indexOf('list=') !== -1) {
           result = appendixElement;
       }
    });
    return result;
};

var getEmbedLink = function (link) {
    var appendixLinkList;
    if (link.indexOf('&list=') !== -1) {
        appendixLinkList = link.replace('https://www.youtube.com/watch?v=', '').split('&');
        return 'https://www.youtube.com/embed/' + appendixLinkList[0] + '?' + getListElement(appendixLinkList);
    }
    return link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');

};

module.exports = {
    getEmbedLink: getEmbedLink
};
