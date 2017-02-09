'use strict';

let db = requireDb();
let image = require('./../../images/uploadImageCDN');
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let cdn = require('elyoos-server-lib').cdn;
let _ = require('underscore');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let createGenericPage = function (userId, params, titlePicturePath) {
    params.pageId = uuid.generateUUID();
    params.recommendationId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    _.defaults(params, {website: null});
    return db.cypher().match("(user:User {userId: {userId}})")
        .createUnique(`(user)-[:IS_ADMIN]->(page:Page {pageId: {pageId}, title: {title}, modified: {created}, created: {created}, 
        label: 'Generic', description: {description}, topic: {topic}, language: {language}, website: {website}})
        <-[:RECOMMENDS]-(rec:Recommendation:PinwallElement {recommendationId: {recommendationId}, created: {created}})<-[:RECOMMENDS]-(user)`)
        .with(`page, rec`)
        .createUnique(`(rec)-[:PINWALL_DATA]->(page)`)
        .end(params).send().then(function () {
            return image.uploadImage(titlePicturePath, 'pages', params.pageId, 450, 1000, 'pages/default/landscape');
        }).then(function () {
            logger.info(`Created generic page with id ${params.pageId}`);
            return {pageId: params.pageId, previewImage: cdn.getUrl(`pages/${params.pageId}/preview.jpg`)};
        });
};

module.exports = {
    createGenericPage: createGenericPage
};
