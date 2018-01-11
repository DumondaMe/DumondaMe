'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let uploadImage = require('./../../../image/generatePageImages');
let imagePage = require('./../imagePage');
let cdn = require('elyoos-server-lib').cdn;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let createBookPage = function (userId, params, titlePicturePath, req) {
    params.pageId = uuid.generateUUID();
    params.recommendationId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.userId = userId;
    params.language = [params.language];
    return imagePage.checkImageSize(titlePicturePath, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})")
            .createUnique(`(user)-[:IS_ADMIN]->(page:Page {pageId: {pageId}, title: {title}, description: {description}, author: {author}, 
            publishDate: {publishDate}, modified: {created}, created: {created}, topic: {topic}, label: 'Book', language: {language}})
            <-[:RECOMMENDS]-(rec:Recommendation:PinwallElement {recommendationId: {recommendationId}, created: {created}})<-[:RECOMMENDS]-(user)`)
            .with(`page, rec`)
            .createUnique(`(rec)-[:PINWALL_DATA]->(page)`)
            .end(params).send();
    }).then(function () {
        return uploadImage.generatePageImage(titlePicturePath, params.pageId);
    }).then(function () {
        logger.info(`Created book page with id ${params.pageId}`);
        return {pageId: params.pageId, bookPreviewUrl: cdn.getUrl(`pages/${params.pageId}/pagePreview.jpg`)};
    });
};

module.exports = {
    createBookPage: createBookPage
};
