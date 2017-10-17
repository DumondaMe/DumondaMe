'use strict';

let db = requireDb();

let getNumberOfToExportOrg = function () {
    return db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC_PENDING]->(org:Page)`)
        .return(`count(*) AS numberOf`).getCommand();
};

let exportOrganizations = async function () {
    let resp = await db.cypher().match(`(:TransitionConnectExport)-[export:EXPORT_TO_TC_PENDING]->(org:Page)
                    <-[:IS_ADMIN]-(admin:User)`)
        .with(`export, org, admin`)
        .orderBy(`admin.email`)
        .with(`export, org, collect(admin.email) AS administrators`)
        .limit(50)
        .delete(`export`)
        .return(`org.pageId AS id, org.title AS name, org.description AS description, '' AS slogan,
                 org.website AS website, org.language[0] AS language, org.topic AS categories,
                 administrators`)
        .orderBy(`org.modified`)
        .end().send([getNumberOfToExportOrg()]);

    return {organizations: resp[1], hasNext: resp[1].length < resp[0][0].numberOf};

};

module.exports = {
    exportOrganizations
};
