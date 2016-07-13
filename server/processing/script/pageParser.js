'use strict';

var _ = require('lodash');

var getPages = function (contents) {
    var pages = {book: {}, link: {}};
    _.forEach(contents, function (content) {
        var id;
        if (content.Key.match(/pages\/[a-zA-Z0-9]{16,}\/pagePreview/)) {
            id = content.Key.substring(6, 6 + 16);
            pages.book[id] = {};
        } else if (content.Key.match(/pages\/[a-zA-Z0-9]{16,}\/preview/)) {
            id = content.Key.substring(6, 6 + 16);
            pages.link[id] = {};
        }
    });
    return pages;
};


module.exports = {
    getPages: getPages
};
