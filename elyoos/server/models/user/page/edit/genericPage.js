'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let image = require('./../../images/uploadImageCDN');
let imagePage = require('./../imagePage');
let security = require('./../security');

let transitionConnectPending = function (pageId) {
    return db.cypher().match(`(page:Page {pageId: {pageId}})<-[:EXPORT_TO_TC]-(export:TransitionConnectExport)`)
        .merge(`(page)<-[:EXPORT_TO_TC_PENDING]-(export)`)
        .end({pageId: pageId}).getCommand();
};

let editGenericPage = async function (userId, params, titlePicturePath, req) {

    await imagePage.checkImageSize(titlePicturePath, req);
    await security.checkAllowedToEditPage(userId, params.pageId, req);
    await db.cypher().match("(page:Page {pageId: {pageId}})")
        .set('page', {
            topic: params.topic,
            title: params.title,
            description: params.description,
            website: params.website,
            language: params.language,
            modified: time.getNowUtcTimestamp()
        })
        .end({pageId: params.pageId}).send([transitionConnectPending(params.pageId)]);
    if (typeof titlePicturePath === 'string' && titlePicturePath.trim() !== '') {
        await image.uploadImage(titlePicturePath, 'pages', params.pageId, 450, 1000);
    }
};

module.exports = {
    editGenericPage: editGenericPage
};
