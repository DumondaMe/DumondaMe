'use strict';

let _ = require('lodash');

let getListElement = function (appendix) {
    let result = '';
    _.forEach(appendix, function (appendixElement) {
        if (appendixElement.indexOf('list=') !== -1) {
            result = appendixElement;
        }
    });
    return result;
};

let getIdElement = function (appendix) {
    let result = '';
    _.forEach(appendix, function (appendixElement) {
        if (appendixElement.indexOf('v=') !== -1) {
            result = appendixElement.replace('v=', '');
        }
    });
    return result;
};

let getBaseUrl = function (link) {
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

let getEmbedLink = function (link) {
    let appendixLinkList, baseUrl;
    baseUrl = getBaseUrl(link);
    if (link.indexOf('list=') !== -1) {
        appendixLinkList = link.replace(baseUrl, '').split('&');
        return 'https://www.youtube.com/embed/' + getIdElement(appendixLinkList) + '?' + getListElement(appendixLinkList);
    }
    return link.replace(baseUrl, 'https://www.youtube.com/embed/');
};

module.exports = {
    getEmbedLink: getEmbedLink
};
