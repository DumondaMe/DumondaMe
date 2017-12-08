'use strict';

let _ = require('lodash');
let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let convertLocations = function (locations) {
    let locationsForJson = [];
    for (let location of locations) {
        locationsForJson.push({
            address: location.address,
            description: location.description,
            geo: {latitude: location.latitude, longitude: location.longitude}
        });
    }
    return locationsForJson;
};

let exportOrganisation = async function (id, req) {
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[EXPORT_TO_TC]->
                            (org:Page {pageId: {pageId}})<-[:IS_ADMIN]-(admin:User)`)
        .with(`org, admin`)
        .orderBy(`admin.email`)
        .with(`org, collect(admin.email) AS admins`)
        .optionalMatch(`(org)-[:HAS]->(address:Address)`)
        .with(`org, admins, address`)
        .orderBy(`address.addressId`)
        .return(`org.modified AS timestamp, org.title AS name, org.description AS description, 
                 '' AS slogan, org.website AS website, org.topic AS categories, admins,
                 collect(address) AS locations`)
        .end({pageId: id}).send();
    if (resp.length === 1) {
        resp[0].locations = convertLocations(resp[0].locations);
        return resp[0];
    } else {
        return exceptions.getInvalidOperation(`organisation ${id} does not exist or is not exported to tc `, logger, req);
    }

};

let deleteAllStopExportToTcRelations = async function (skip) {
    if (skip === 0) {
        await db.cypher().match(`(tc:TransitionConnectExport)-[export:STOP_EXPORT_TO_TC]->(org:Page)`)
            .optionalMatch(`(org)-[:EVENT]->(:Event)<-[exportEvent:EXPORT_EVENT_TO_TC]-(tc)`)
            .delete(`export, exportEvent`).end().send();
    }
};

let getTimestampList = function (listOrganisations) {
    let list = [];
    for (let organisation of listOrganisations) {
        list.push({id: organisation.id, timestamp: _.max([organisation.modified, organisation.modifiedAddress])});
    }
    return list;
};

let getListOrganisations = async function (skip) {
    await deleteAllStopExportToTcRelations(skip);
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC|STOP_EXPORT_TO_TC]->(org:Page)`)
        .return(`org.pageId AS id, org.modified AS modified, org.modifiedAddress AS modifiedAddress`)
        .orderBy(`export.timestampExportStarted`)
        .skip(`{skip}`)
        .limit(`10000`)
        .end({skip: skip}).send();
    return {organisations: getTimestampList(resp)};
};

module.exports = {
    exportOrganisation,
    getListOrganisations
};
