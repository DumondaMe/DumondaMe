'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createTransitionConnectExportNode = function () {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:TransitionConnectExport)`).end().getCommand());
};

let exportOrganization = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(tcExport:TransitionConnectExport), (org:Page {pageId: {pageId}})`)
        .merge((`(tcExport)-[:EXPORT_TO_TC]->(org)`))
        .end({pageId: data.pageId}).getCommand());
};

let exportOrganizationPending = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(tcExport:TransitionConnectExport), (org:Page {pageId: {pageId}})`)
        .merge((`(tcExport)-[:EXPORT_TO_TC_PENDING]->(org)`))
        .end({pageId: data.pageId}).getCommand());
};

module.exports = {
    createTransitionConnectExportNode,
    exportOrganization,
    exportOrganizationPending
};