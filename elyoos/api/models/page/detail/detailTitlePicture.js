'use strict';

let cdn = require('elyoos-server-lib').cdn;

let addTitlePicture = function (pageId, detail) {
    detail.titleUrl = cdn.getUrl('pages/' + pageId + '/pageTitlePicture.jpg');
};

module.exports = {
    addTitlePicture: addTitlePicture
};
