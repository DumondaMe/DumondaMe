'use strict';

var db = require('./../../../neo4j');
var image = require('./../images/uploadImageCDN');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var imagePage = require('./imagePage');
var Url = require('url-parse');
var exceptions = require('./../../../lib/error/exceptions');
var cdn = require('../../util/cdn');
var logger = requireLogger.getLogger(__filename);

var getHostname = function (link, req) {
    var host = new Url(link).host;
    if (!host) {
        return exceptions.getInvalidOperation(`User tries to add invalid url ${link}`, logger, req);
    } else if (link.indexOf('youtube.com') > -1) {
        return exceptions.getInvalidOperation(`User tries to add youtube url ${link}`, logger, req);
    }
    return host;
};

var createLinkPage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return getHostname(params.link, req);
    }).then(function (hostname) {
        params.hostname = hostname;
        return db.cypher().match("(user:User {userId: {userId}})")
            .createUnique("(user)-[:IS_ADMIN]->(:Page {pageId: {pageId}, title: {title}, description: {description}, link: {link}, " +
                "modified: {created}, created: {created}, topic: {topic}, label: 'Link', hostname: {hostname}, language: {language}})")
            .end(params).send();
    }).then(function () {
        if (typeof titlePicturePath === 'string' && titlePicturePath.trim() !== '') {
            return image.uploadImage(titlePicturePath, 'pages', params.pageId, 380, 1000);
        }
    }).then(function (height) {
        if (height) {
            return db.cypher().match("(page:Page {pageId: {pageId}})").set('page', {heightPreviewImage: height}).return("page")
                .end({pageId: params.pageId}).send();
        }
    }).then(function (pages) {
        var resp = {pageId: params.pageId, hostname: params.hostname};
        if(pages && pages.length === 1) {
            resp.linkPreviewUrl = cdn.getUrl(`pages/${params.pageId}/preview.jpg`);
        }
        return resp;
    });
};

module.exports = {
    createLinkPage: createLinkPage
};
