'use strict';

let db = requireDb();
let security = require('./security');
let cdn = require('../../util/cdn');

let deletePage = function (userId, params, req) {

    return security.checkAllowedToDeletePage(userId, params.pageId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})-[isAdmin:IS_ADMIN]->(page:Page {pageId: {pageId}})")
            .optionalMatch("(user)-[recRel:RECOMMENDS]->(rec:Recommendation)-[recRel2:RECOMMENDS|PINWALL_DATA]->(page)")
            .optionalMatch("(page)-[addressRel:HAS]->(address:Address)")
            .delete("isAdmin, page, recRel, rec, recRel2, addressRel, address")
            .end({userId: userId, pageId: params.pageId})
            .send().then(function () {
                return cdn.deleteFolder(`pages/${params.pageId}/`);
            });
    });
};

module.exports = {
    deletePage: deletePage
};
