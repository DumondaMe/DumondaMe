'use strict';

var db = require('./../../../neo4j');
var exceptions = require('./../../../lib/error/exceptions');
var cdn = require('../../util/cdn');
var logger = requireLogger.getLogger(__filename);

var allowedToRemoveBlog = function (userId, blogId, req) {
    return db.cypher().match("(user:User {userId: {userId}})-[written:WRITTEN]->(blog:Blog {blogId: {blogId}})")
        .return("count(*) AS count")
        .end({userId: userId, blogId: blogId}).send()
        .then(function (resp) {
            if (resp[0].count === 0) {
                return exceptions.getInvalidOperation('User [' + userId + '] tries to delete blog of other user. BlogId [' + blogId + ']',
                    logger, req);
            }
        });
};

var removeBlog = function (userId, request, req) {
    return allowedToRemoveBlog(userId, request.blogId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})-[written:WRITTEN]->(blog:Blog {blogId: {blogId}})")
            .delete("written, blog")
            .end({userId: userId, blogId: request.blogId})
            .send()
            .then(function () {
                cdn.deleteFolder('blog/' + request.blogId + '/');
            });
    });
};

module.exports = {
    removeBlog: removeBlog
};
