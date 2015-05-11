'use strict';

var db = require('./../../../neo4j');
var logger = requireLogger.getLogger(__filename);
var underscore = require('underscore');
var cdn = require('../../util/cdn');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var gm = require('./../../util/gm');
var exceptions = require('./../../../lib/error/exceptions');
var uploadImage = require('./../../image/generatePageImages');

var checkImageSize = function (titlePicturePath, req) {
    return gm.gm(titlePicturePath).sizeAsync().then(function (size) {
        if (size.width < 300 || size.height < 200) {
            return exceptions.getInvalidOperation('User tries to add to small image ' + size.width + 'x' + size.height, logger, req);
        }
    });
};

var createBookPage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.modified = time.getNowUtcTimestamp();
    params.userId = userId;
    return checkImageSize(titlePicturePath, req).then(function () {
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
