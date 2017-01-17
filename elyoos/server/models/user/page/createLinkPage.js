'use strict';

let db = requireDb();
let image = require('./../images/uploadImageCDN');
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let imagePage = require('./imagePage');
let Url = require('url-parse');
let exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('../../util/cdn');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getHostname = function (link, req) {
    let host = new Url(link).host;
    if (!host) {
        return exceptions.getInvalidOperation(`User tries to add invalid url ${link}`, logger, req);
    } else if (link.indexOf('youtube.com') > -1) {
        return exceptions.getInvalidOperation(`User tries to add youtube url ${link}`, logger, req);
    }
    return host;
};

let createLinkPage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.recommendationId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return getHostname(params.link, req);
    }).then(function (hostname) {
        params.hostname = hostname;
        return db.cypher().match("(user:User {userId: {userId}})")
            .createUnique(`(user)-[:IS_ADMIN]->(page:Page {pageId: {pageId}, title: {title}, description: {description}, link: {link}, 
              modified: {created}, created: {created}, topic: {topic}, label: 'Link', hostname: {hostname}, language: {language}})
              <-[:RECOMMENDS]-(rec:Recommendation:PinwallElement {recommendationId: {recommendationId}, created: {created}})<-[:RECOMMENDS]-(user)`)
            .with(`page, rec`)
            .createUnique(`(rec)-[:PINWALL_DATA]->(page)`)
            .end(params).send();
    }).then(function () {
        if (typeof titlePicturePath === 'string' && titlePicturePath.trim() !== '') {
            return image.uploadImage(titlePicturePath, 'pages', params.pageId, 450, 1000);
        }
    }).then(function (height) {
        if (height) {
            return db.cypher().match("(page:Page {pageId: {pageId}})").set('page', {heightPreviewImage: height}).return("page")
                .end({pageId: params.pageId}).send();
        }
    }).then(function (pages) {
        logger.info(`Created link page with id ${params.pageId}`);
        let resp = {pageId: params.pageId, hostname: params.hostname};
        if(pages && pages.length === 1) {
            resp.linkPreviewUrl = cdn.getUrl(`pages/${params.pageId}/preview.jpg`);
        }
        return resp;
    });
};

module.exports = {
    createLinkPage: createLinkPage
};
