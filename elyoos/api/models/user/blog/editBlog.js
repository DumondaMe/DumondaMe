'use strict';

let db = requireDb();
let upload = require('./upload');
let time = require('elyoos-server-lib').time;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let security = function (userId, pageId, req) {
    return db.cypher().match("(:User {userId: {userId}})-[:WRITTEN]->(blog:Blog {pageId: {pageId}})")
        .return("blog")
        .end({userId: userId, pageId: pageId}).send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`User ${userId} is not writer of blog ${pageId}`, logger, req);
            }
        });
};

let editBlog = function (userId, request, filePath, req) {
    let timestamp = time.getNowUtcTimestamp();
    return security(userId, request.pageId, req).then(function () {
        return upload.uploadFile(filePath, request.pageId)
            .then(function (height) {
                return db.cypher().match("(blog:Blog {pageId: {pageId}})")
                    .set('blog', {text: request.text, topic: request.topic, heightPreviewImage: height, language: [request.language],
                    modified: timestamp})
                    .end({pageId: request.pageId}).send();
            }).then( function () {
                return {modified: timestamp};
            });
    });
};

module.exports = {
    editBlog: editBlog
};
