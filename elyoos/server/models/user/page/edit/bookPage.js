'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uploadImage = require('./../../../image/generatePageImages');
let imagePage = require('./../imagePage');
let security = require('./../security');

let editBookPage = function (userId, params, titlePicturePath, req) {
    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return security.checkAllowedToEditPage(userId, params.pageId, req);
    }).then(function () {
        return db.cypher().match("(page:Page {pageId: {pageId}})")
            .set('page', {
                topic: params.topic,
                description: params.description,
                author: params.author,
                publishDate: params.publishDate,
                language: [params.language],
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId})
            .send();
    }).then(function () {
        if (titlePicturePath) {
            return uploadImage.generatePageImage(titlePicturePath, params.pageId);
        }
    });
};

module.exports = {
    editBookPage: editBookPage
};
