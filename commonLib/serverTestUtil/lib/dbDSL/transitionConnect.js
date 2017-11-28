'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let exportOrganisation = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(org:Page {pageId: {pageId}})`)
        .merge(`(tcExport:TransitionConnectExport)`)
        .merge((`(tcExport)-[:EXPORT_TO_TC]->(org)`))
        .set(`org`, {exportToTc: true})
        .end({pageId: data.pageId}).getCommand());
};

module.exports = {
    exportOrganisation
};