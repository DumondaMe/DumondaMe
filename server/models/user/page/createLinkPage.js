'use strict';

var db = require('./../../../neo4j');
var image = require('./../images/uploadImageCDN');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var imagePage = require('./imagePage');
var Url = require('url-parse');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var getUrl = function (link, req) {
    var host = new Url(link).host;
    if (!host) {
        return exceptions.getInvalidOperation(`User tries to add invalid url ${link}`, logger, req);
    }
    return host;
};

var createLinkPage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        params.hostname = getUrl(params.link);
        return db.cypher().match("(user:User {userId: {userId}})")
            .createUnique("(user)-[:IS_ADMIN]->(:Page {pageId: {pageId}, title: {title}, description: {description}, link: {link}, " +
                "modified: {created}, created: {created}, category: {category}, label: 'Link', hostname: {hostname}})")
            .end(params).send();
    }).then(function () {
        if (typeof titlePicturePath === 'string' && titlePicturePath.trim() !== '') {
            return image.uploadImage(titlePicturePath, 'page', params.pageId, 380, 1000);
        }
    }).then(function () {
        return {pageId: params.pageId};
    });
};

module.exports = {
    createLinkPage: createLinkPage
};
