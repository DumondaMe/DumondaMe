'use strict';

var db = require('./../../../neo4j');
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
            .createUnique("(user)-[:IS_ADMIN]->(:Page {pageId: {pageId}, title: {title}, description: {description}, author: {author}, " +
            "publishDate: {publishDate}, modified: {modified}, category: {category}, label: 'Book'})")
            .end(params)
            .send();
    }).then(function () {
        return uploadImage.generatePageImage(titlePicturePath, params.pageId);
    }).then(function () {
        return {pageId: params.pageId};
    });
};

module.exports = {
    createBookPage: createBookPage
};
