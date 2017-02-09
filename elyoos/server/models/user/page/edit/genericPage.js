'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let image = require('./../../images/uploadImageCDN');
let imagePage = require('./../imagePage');
let security = require('./../security');

let editGenericPage = function (userId, params, titlePicturePath, req) {

    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return security.checkAllowedToEditPage(userId, params.pageId, req);
    }).then(function () {
        return db.cypher().match("(page:Page {pageId: {pageId}})")
            .set('page', {
                topic: params.topic,
                title: params.title,
                description: params.description,
                website: params.website,
                language: params.language,
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId}).send();
    }).then(function () {
        if (typeof titlePicturePath === 'string' && titlePicturePath.trim() !== '') {
            return image.uploadImage(titlePicturePath, 'pages', params.pageId, 450, 1000);
        }
    });
};

module.exports = {
    editGenericPage: editGenericPage
};
