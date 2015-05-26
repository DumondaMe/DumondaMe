'use strict';

var db = require('./../../../neo4j');
var logger = requireLogger.getLogger(__filename);
var uuid = require('./../../../lib/uuid');
var time = require('./../../../lib/time');

var createVideoPage = function (userId, params) {
    params.pageId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    return db.cypher().match("(user:User {userId: {userId}})")
        .createUnique("(user)-[:IS_ADMIN]->(:VideoPage {pageId: {pageId}, title: {title}, description: {description}, link: {link}, " +
        "subCategory: {subCategory}, modified: {created}, created: {created}, language: {language}})")
        .end(params)
        .send().then(function () {
            return {pageId: params.pageId};
        });
};

module.exports = {
    createVideoPage: createVideoPage
};
