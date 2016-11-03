'use strict';

var db = require('./../../../neo4j');
var image = require('./../images/uploadImageCDN');
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');
var cdn = require('../../util/cdn');
var securityKeyword = require('../../keyword/security');
var _ = require('underscore');
var logger = requireLogger.getLogger(__filename);

var createPlacePage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    _.defaults(params, {website: null});
    return securityKeyword.allowedKeywords(params.keywords, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})")
            .createUnique(`(user)-[:IS_ADMIN]->(page:Page {pageId: {pageId}, title: {title}, modified: {created}, created: {created}, label: 'Place', 
        description: {description}, topic: {topic}, language: {language}, website: {website}})
        foreach (address in {places} | CREATE (page)-[:HAS]->(:Address {description: address.description, latitude: toFloat(address.lat), 
        longitude: toFloat(address.lng)}))`)
            .with("page")
            .match("(keyword:Keyword)")
            .where("keyword.de IN {keywords}")
            .createUnique("(page)-[:HAS_KEYWORD]->(keyword)")
            .end(params).send().then(function () {
                return image.uploadImage(titlePicturePath, 'pages', params.pageId, 450, 1000, 'pages/default/landscape');
            }).then(function () {
                logger.info(`Created place page with id ${params.pageId}`);
                return {pageId: params.pageId, titlePreviewUrl: cdn.getUrl(`pages/${params.pageId}/preview.jpg`)};
            });
    });
};

module.exports = {
    createPlacePage: createPlacePage
};
