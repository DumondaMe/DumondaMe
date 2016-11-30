'use strict';

var db = requireDb();
var time = requireLib('time');
var image = require('./../images/uploadImageCDN');
var imagePage = require('./imagePage');
var security = require('./security');

var editLinkPage = function (userId, params, titlePicturePath, req) {

    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return security.checkAllowedToEditPage(userId, params.pageId, req);
    }).then(function () {
        return db.cypher().match("(page:Page {pageId: {pageId}})")
            .set('page', {
                topic: params.topic,
                description: params.description,
                language: params.language,
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId}).send();
    }).then(function () {
        if (typeof titlePicturePath === 'string' && titlePicturePath.trim() !== '') {
            return image.uploadImage(titlePicturePath, 'pages', params.pageId, 380, 1000);
        }
    }).then(function (height) {
        if (height) {
            return db.cypher().match("(page:Page {pageId: {pageId}})").set('page', {heightPreviewImage: height}).end({pageId: params.pageId}).send();
        }
    });
};

module.exports = {
    editLinkPage: editLinkPage
};
