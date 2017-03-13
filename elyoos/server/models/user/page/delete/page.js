'use strict';

let db = requireDb();
let security = require('./../security');
let cdn = require('elyoos-server-lib').cdn;

let deletePage = function (userId, params, req) {

    return security.checkAllowedToDeletePage(userId, params.pageId, req).then(function () {
        return db.cypher().match("(user:User {userId: {userId}})-[isAdmin:IS_ADMIN]->(page:Page {pageId: {pageId}})")
            .optionalMatch("(user)-[recRel:RECOMMENDS]->(rec:Recommendation)-[recRel2:RECOMMENDS|PINWALL_DATA]->(page)")
            .optionalMatch("(page)-[addressRel:HAS]->(address:Address)")
            .optionalMatch("(page)-[eventRel:EVENT]->(event:Event)-[address2Rel:HAS]->(address2:Address)")
            .delete("isAdmin, page, recRel, rec, recRel2, addressRel, address2Rel, address, address2, eventRel, event")
            .end({userId: userId, pageId: params.pageId})
            .send().then(function () {
                return cdn.deleteFolder(`pages/${params.pageId}/`);
            });
    });
};

module.exports = {
    deletePage: deletePage
};
