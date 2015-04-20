'use strict';

var logger = requireLogger.getLogger(__filename);
var cdn = require('../../util/cdn');

var addTitlePicture = function (pageId, detail, type) {
    detail.titleUrl = cdn.getUrl('pages/' + type + '/' + pageId + '/pageTitlePicture.jpg');
};

module.exports = {
    addTitlePicture: addTitlePicture
};
