'use strict';

let db = requireDb();

let deleteOrg = async function (pageId) {
    return await db.cypher().match(`(org:Page:ImportTC {pageId: {pageId}})`)
        .set(`org`, {markDeleted: true})
        .end({pageId: pageId}).send();
};

module.exports = {
    delete: deleteOrg
};
