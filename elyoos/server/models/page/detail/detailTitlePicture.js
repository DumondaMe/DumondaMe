'use strict';

var cdn = require('../../util/cdn');

var addTitlePicture = function (pageId, detail) {
    detail.titleUrl = cdn.getUrl('pages/' + pageId + '/pageTitlePicture.jpg');
};

module.exports = {
    addTitlePicture: addTitlePicture
};
