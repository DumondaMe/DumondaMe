'use strict';

let db = requireDb();
let security = require('./../security');
let time = require('elyoos-server-lib').time;
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
    await db.cypher().match(`(page:Page {pageId: {pageId}})`)
        .merge(`(tcExport:TransitionConnectExport)`)
        .merge(`(page)<-[:EXPORT_TO_TC {timestampExportStarted: {now}}]-(tcExport)`)
        .return(`page`)
        .union()
        .match(`(page:Page {pageId: {pageId}})-[:EVENT]->(event:Event), (tcExport:TransitionConnectExport)`)
        .merge(`(event)<-[exportRel:EXPORT_EVENT_TO_TC]-(tcExport)`)
        .onCreate(`SET exportRel.timestampExportStarted = {now}`)
        .return(`page`)
        .union()
        .match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC]->(page:Page {pageId: {pageId}})
                 <-[stopExport:STOP_EXPORT_TO_TC]-(:TransitionConnectExport)`)
        .addCommand(` SET export.timestampExportStarted = stopExport.timestampExportStarted`)
        .delete(`stopExport`)
        .return(`page`)
        .end({pageId: pageId, now: time.getNowUtcTimestamp()}).send();
};

let deactivateSync = async function (pageId) {
    await db.cypher().match(`(page:Page {pageId: {pageId}})<-[export:EXPORT_TO_TC]-(tcExport:TransitionConnectExport)`)
        .merge(`(page)<-[:STOP_EXPORT_TO_TC {timestampExportStarted: export.timestampExportStarted}]-(tcExport)`)
        .delete(`export`)
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
