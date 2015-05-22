'use strict';

var db = require('./../../../neo4j');
var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var uploadImage = require('./../../image/generatePageImages');
var commonBookPage = require('./commonBookPage');
var security = require('./security');

var editBookPage = function (userId, params, titlePicturePath, req) {
    return commonBookPage.checkImageSize(titlePicturePath, req).then(function () {
        return security.checkAllowedToEditPage(userId, params.pageId, 'BookPage', req);
    }).then(function () {
        return db.cypher().match("(page:BookPage {pageId: {pageId}})")
            .set('page', {
                language: params.language,
                description: params.description,
                author: params.author,
                title: params.title,
                publishDate: params.publishDate,
                modified: time.getNowUtcTimestamp()
            })
            .end({pageId: params.pageId})
            .send();
    }).then(function () {
        if (titlePicturePath) {
            return uploadImage.generatePageImage(titlePicturePath, 'BookPage', params.pageId);
        }
    });
};

module.exports = {
    editBookPage: editBookPage
};
