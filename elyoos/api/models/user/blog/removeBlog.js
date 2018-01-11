'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('elyoos-server-lib').cdn;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let allowedToRemoveBlog = function (userId, pageId, req) {
    return db.cypher().match("(user:User {userId: {userId}})-[written:WRITTEN]->(blog:Blog {pageId: {pageId}})")
        .return("count(*) AS count")
        .end({userId: userId, pageId: pageId}).send()
        .then(function (resp) {
            if (resp[0].count === 0) {
                return exceptions.getInvalidOperation('User [' + userId + '] tries to delete blog of other user. BlogId [' + pageId + ']',
                    logger, req);
            }
        });
};

let removeBlog = function (userId, request, req) {
    return allowedToRemoveBlog(userId, request.pageId, req).then(function () {
        return db.cypher().match(`(user:User {userId: {userId}})-[written:WRITTEN]->(blog:Blog {pageId: {pageId}})`)
            .optionalMatch(`(blog)<-[r1:RECOMMENDS]-(rec:Recommendation)<-[r2:RECOMMENDS]-()`)
            .optionalMatch("(blog)<-[p:PINWALL_DATA]-()")
            .delete("written, blog, r1, rec, r2, p")
            .end({userId: userId, pageId: request.pageId}).send().then(function () {
                return cdn.deleteFolder('blog/' + request.pageId + '/');
            });
    });
};

module.exports = {
    removeBlog: removeBlog
};
