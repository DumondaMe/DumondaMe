'use strict';

var logger = requireLogger.getLogger(__filename);
var cdn = require('../../util/cdn');

var addTitlePicture = function (pageId, detail) {
    detail.titleUrl = cdn.getUrl('pages/BookPage/' + pageId + '/pageTitlePicture.jpg');
};

module.exports = {
    addTitlePicture: addTitlePicture
};
