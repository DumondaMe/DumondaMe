'use strict';

var db = require('./../../../neo4j');
var security = require('./security');

var deletePage = function (userId, params, req) {

    return security.checkAllowedToDeletePage(userId, params.pageId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})-[isAdmin:IS_ADMIN]->(page:Page {pageId: {pageId}})")
            .optionalMatch("(user)-[recRel:RECOMMENDS]->(rec:Recommendation)-[recRel2:RECOMMENDS]->(page)")
            .delete("isAdmin, page, recRel, rec, recRel2")
            .end({userId: userId, pageId: params.pageId})
            .send();
    });
};

module.exports = {
    deletePage: deletePage
};
