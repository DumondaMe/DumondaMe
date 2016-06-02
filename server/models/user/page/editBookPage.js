'use strict';

var db = require('./../../../neo4j');
var time = require('./../../../lib/time');
var uploadImage = require('./../../image/generatePageImages');
var imagePage = require('./imagePage');
var security = require('./security');

var editBookPage = function (userId, params, titlePicturePath, req) {
    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return security.checkAllowedToEditPage(userId, params.pageId, req);
    }).then(function () {
        return db.cypher().match("(page:Page {pageId: {pageId}})")
            .set('page', {
                topic: params.topic,
                description: params.description,
                author: params.author,
                publishDate: params.publishDate,
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
