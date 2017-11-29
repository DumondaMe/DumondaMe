'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let exportEvent = async function (id, req) {
    
};

let getListEvents = async function (skip) {
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_EVENT_TO_TC]->(event:Event)`)
        .return(`event.uid AS uid, event.modified AS timestamp`)
        .orderBy(`export.timestampExportStarted`)
        .skip(`{skip}`)
        .limit(`10000`)
        .end({skip: skip}).send();
    return {events: resp};
};

module.exports = {
    exportEvent,
    getListEvents
};
