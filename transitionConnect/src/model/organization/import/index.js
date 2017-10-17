'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;

let importOrganizations = async function (organizations) {
    await db.cypher().unwind(`{organizations} AS organization`)
        .merge(`(org:Page:ImportTC {pageId: organization.uuid})`)
        .onCreate(`SET org.created = {now}, org.label = 'Generic'`)
        .addCommand(` SET org.title = organization.name, org.description = organization.description,
                    org.slogan = organization.slogan, org.website = organization.website, 
                    org.language = [organization.language], org.topic = organization.categories,
                    org.modified = {now}`)
        .end({organizations: organizations, now: time.getNowUtcTimestamp()}).send();

};

module.exports = {
    importOrganizations
};
