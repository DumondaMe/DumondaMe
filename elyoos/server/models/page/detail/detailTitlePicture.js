'use strict';

let cdn = require('../../util/cdn');

let addTitlePicture = function (pageId, detail) {
    detail.titleUrl = cdn.getUrl('pages/' + pageId + '/pageTitlePicture.jpg');
};

module.exports = {
    addTitlePicture: addTitlePicture
};
