'use strict';

var db = require('./../../../neo4j');
var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var uploadImage = require('./../../image/generatePageImages');
var commonBookPage = require('./commonBookPage');

var createBookPage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.modified = time.getNowUtcTimestamp();
    params.userId = userId;
    return commonBookPage.checkImageSize(titlePicturePath, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})")
            .createUnique("(user)-[:IS_ADMIN]->(:BookPage {pageId: {pageId}, title: {title}, description: {description}, author: {author}, " +
            "publishDate: {publishDate}, modified: {modified}, language: {language}})")
            .end(params)
            .send();
    }).then(function () {
        return uploadImage.generatePageImage(titlePicturePath, 'BookPage', params.pageId);
    }).then(function () {
        return {pageId: params.pageId};
    });
};

module.exports = {
    createBookPage: createBookPage
};
