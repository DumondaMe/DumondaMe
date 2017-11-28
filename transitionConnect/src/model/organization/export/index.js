'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let exportOrganisation = async function (id, req) {
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[EXPORT_TO_TC]->
                            (org:Page {pageId: {pageId}})<-[:IS_ADMIN]-(admin:User)`)
        .with(`org, admin`)
        .orderBy(`admin.email`)
        .with(`org, collect(admin.email) AS admins`)
        .return(`org.modified AS timestamp, org.title AS name, org.description AS description, 
                 '' AS slogan, org.website AS website, org.topic AS categories, admins`)
        .end({pageId: id}).send();
    if (resp.length === 1) {
        return resp[0];
    } else {
        return exceptions.getInvalidOperation(`organisation ${id} does not exist or is not exported to tc `, logger, req);
    }

};

let getListOrganisations = async function (skip) {
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[:EXPORT_TO_TC]->(org:Page)`)
        .return(`org.pageId AS id, org.modified AS timestamp`)
        .orderBy(`org.created`)
        .skip(`{skip}`)
        .limit(`1000`)
        .end({skip: skip}).send();

    return {organisations: resp};
};

module.exports = {
    exportOrganisation,
    getListOrganisations
};
