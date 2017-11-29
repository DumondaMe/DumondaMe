'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let exportOrganisation = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(org:Page {pageId: {pageId}})`)
        .merge(`(tcExport:TransitionConnectExport)`)
        .merge((`(tcExport)-[:EXPORT_TO_TC {timestampExportStarted: {timestampExportStarted}}]->(org)`))
        .end({pageId: data.pageId, timestampExportStarted: data.timestampExportStarted}).getCommand());
};

let exportEvent = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(event:Event {eventId: {eventId}})`)
        .merge(`(tcExport:TransitionConnectExport)`)
        .merge((`(tcExport)-[:EXPORT_EVENT_TO_TC {timestampExportStarted: {timestampExportStarted}}]->(event)`))
        .end({eventId: data.eventId, timestampExportStarted: data.timestampExportStarted}).getCommand());
};

let stopExportOrganisation = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(org:Page {pageId: {pageId}})`)
        .merge(`(tcExport:TransitionConnectExport)`)
        .merge((`(tcExport)-[:STOP_EXPORT_TO_TC {timestampExportStarted: {timestampExportStarted}}]->(org)`))
        .end({pageId: data.pageId, timestampExportStarted: data.timestampExportStarted}).getCommand());
};

module.exports = {
    exportOrganisation,
    exportEvent,
    stopExportOrganisation
};