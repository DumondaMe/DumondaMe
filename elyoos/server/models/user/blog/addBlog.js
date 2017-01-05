'use strict';

let db = requireDb();
let image = require('./../images/uploadImageCDN');
let _ = require('underscore');
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('../../util/cdn');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let MAX_BLOG_PER_HOUR = 50;

let getVisibility = function (visibility) {
    if (_.isArray(visibility)) {
        return visibility;
    }
    return null;
};

let checkVisibilityExists = function (userId, visibility) {
    return db.cypher().match("(:User {userId: {userId}})-[privacy:HAS_PRIVACY]->(:Privacy)")
        .where("privacy.type IN {visibility}")
        .return("count(*) AS count")
        .end({userId: userId, visibility: visibility});
};

let checkMaxNumberOfMessageSent = function (userId) {
    let lastHour = time.getNowUtcTimestamp() - 3600;
    return db.cypher().match("(:User {userId: {userId}})-[:WRITTEN]->(blog:Blog)")
        .where("blog.created > {lastHour}")
        .return("count(*) AS count")
        .end({userId: userId, lastHour: lastHour});
};

let security = function (userId, visibility, req) {
    if (_.isArray(visibility)) {
        return checkVisibilityExists(userId, visibility)
            .send([checkMaxNumberOfMessageSent(userId).getCommand()])
            .then(function (resp) {
                if (resp[0][0].count >= MAX_BLOG_PER_HOUR) {
                    return exceptions.getInvalidOperation("To many blog messages", logger, req);
                }
                if (resp[1][0].count !== visibility.length) {
                    return exceptions.getInvalidOperation("Visibility does not exist " + visibility.join(";"), logger, req);
                }
            });
    }
    return checkMaxNumberOfMessageSent(userId).send()
        .then(function (resp) {
            if (resp[0].count >= MAX_BLOG_PER_HOUR) {
                return exceptions.getInvalidOperation("To many blog messages", logger, req);
            }
        });
};

let uploadFile = function (filePath, pageId) {
    if (_.isString(filePath)) {
        return image.uploadImage(filePath,'blog', pageId, 450, 1000);
    }
    return Promise.resolve(null);
};

let addBlog = function (userId, request, filePath, req) {
    let commands = [], visibility = getVisibility(request.visibility), pageId = uuid.generateUUID();

    return security(userId, request.visibility, req).then(function () {
        return uploadFile(filePath, pageId)
            .then(function (height) {
                return db.cypher().match("(user:User {userId: {userId}})")
                    .create(`(user)-[:WRITTEN]->(blog:Blog:Page:PinwallElement {text: {text}, title: {title}, created: {timestamp}, 
                              pageId: {pageId}, heightPreviewImage: {heightPreviewImage}, visible: {visibility}, topic: {topic}, 
                              language: {language}, label: 'Blog'})`)
                    .return("blog.pageId AS pageId, blog.text AS text, blog.created AS created, user.name AS name, " +
                        "blog.heightPreviewImage AS heightPreviewImage")
                    .end({
                        userId: userId, timestamp: time.getNowUtcTimestamp(), visibility: visibility, pageId: pageId, text: request.text,
                        title: request.title, topic: request.topic, heightPreviewImage: height, language: [request.language]
                    })
                    .send(commands);
            }).then(function (resp) {
                if (resp[0].hasOwnProperty('heightPreviewImage')) {
                    resp[0].url = cdn.getUrl('blog/' + pageId + '/preview.jpg');
                    resp[0].urlFull = cdn.getUrl('blog/' + pageId + '/normal.jpg');
                }
                resp[0].profileUrl = cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg');
                return resp[0];
            });
    });
};

module.exports = {
    addBlog: addBlog
};
