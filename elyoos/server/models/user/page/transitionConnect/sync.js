'use strict';

let db = requireDb();
let security = require('./../security');
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkIsAllowedToSetState = async function (userId, pageId, req) {
    await security.checkAllowedToEditPage(userId, pageId, req);
    let res = await db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .return(`page:ImportTC AS isImported`)
        .end({pageId: pageId}).send();
    if (res.length > 0 && res[0].isImported) {
        return exceptions.getInvalidOperation(`User tries to export imported organization ${pageId}`, logger, req);
    }
};

let activateSync = async function (pageId) {
    await db.cypher().match(`(page:Page {pageId: {pageId}}), (tcExport:TransitionConnectExport)`)
        .merge(`(page)<-[:EXPORT_TO_TC_PENDING]-(tcExport)`)
        .set(`page`, {exportToTc: true})
        .end({pageId: pageId}).send();
};

let deactivateSync = async function (pageId) {
    await db.cypher().match(`(page:Page {pageId: {pageId}}), (tcExport:TransitionConnectExport)`)
        .optionalMatch(`(page)<-[exportPending:EXPORT_TO_TC_PENDING]-(tcExport)`)
        .delete(`exportPending`)
        .remove(`page.exportToTc`)
        .end({pageId: pageId}).send();
};

let setSyncState = async function (userId, pageId, state, req) {
    await checkIsAllowedToSetState(userId, pageId, req);
    if (state) {
        await activateSync(pageId);
    } else {
        await deactivateSync(pageId);
    }
};

module.exports = {
    setSyncState
};
