'use strict';

var db = require('./../../../neo4j');
var image = require('./../images/uploadImageCDN');
var _ = require('underscore');
var time = require('./../../../lib/time');
var uuid = require('./../../../lib/uuid');
var exceptions = require('./../../../lib/error/exceptions');
var cdn = require('../../util/cdn');
var logger = requireLogger.getLogger(__filename);

var MAX_BLOG_PER_HOUR = 50;

var getVisibility = function (visibility) {
    if (_.isArray(visibility)) {
        return visibility;
    }
    return null;
};

var checkVisibilityExists = function (userId, visibility) {
    return db.cypher().match("(:User {userId: {userId}})-[privacy:HAS_PRIVACY]->(:Privacy)")
        .where("privacy.type IN {visibility}")
        .return("count(*) AS count")
        .end({userId: userId, visibility: visibility});
};

var checkMaxNumberOfMessageSent = function (userId) {
    var lastHour = time.getNowUtcTimestamp() - 3600;
    return db.cypher().match("(:User {userId: {userId}})-[:WRITTEN]->(blog:Blog)")
        .where("blog.created > {lastHour}")
        .return("count(*) AS count")
        .end({userId: userId, lastHour: lastHour});
};

var security = function (userId, visibility, req) {
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

var uploadFile = function (filePath, blogId) {
    if (_.isString(filePath)) {
        return image.uploadImage(filePath,'blog', blogId, 380, 1000);
    }
    return Promise.resolve(null);
};

var addBlog = function (userId, request, filePath, req) {
    var commands = [], visibility = getVisibility(request.visibility), blogId = uuid.generateUUID();

    return security(userId, request.visibility, req).then(function () {
        return uploadFile(filePath, blogId)
            .then(function (height) {
                return db.cypher().match("(user:User {userId: {userId}})")
                    .create("(user)-[:WRITTEN]->(blog:Blog:PinwallElement {text: {text}, created: {timestamp}, " +
                        "blogId: {blogId}, heightPreviewImage: {heightPreviewImage}, visible: {visibility}, topic: {topic}})")
                    .return("blog.blogId AS blogId, blog.text AS text, blog.created AS created, user.name AS name, " +
                        "blog.heightPreviewImage AS heightPreviewImage")
                    .end({
                        userId: userId, timestamp: time.getNowUtcTimestamp(), visibility: visibility, blogId: blogId, text: request.text,
                        topic: request.topic, heightPreviewImage: height
                    })
                    .send(commands);
            }).then(function (resp) {
                if (resp[0].hasOwnProperty('heightPreviewImage')) {
                    resp[0].url = cdn.getUrl('blog/' + blogId + '/preview.jpg');
                    resp[0].urlFull = cdn.getUrl('blog/' + blogId + '/normal.jpg');
                }
                resp[0].profileUrl = cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg');
                return resp[0];
            });
    });
};

module.exports = {
    addBlog: addBlog
};
