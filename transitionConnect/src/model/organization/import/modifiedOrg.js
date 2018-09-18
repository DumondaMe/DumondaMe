'use strict';

let db = requireDb();
let time = require('dumonda-me-server-lib').time;
let uuid = require('dumonda-me-server-lib').uuid;

let getLocation = function (locations) {
    let newLocations = locations || [];
    for (let location of newLocations) {
        location.addressId = uuid.generateUUID();
    }
    return newLocations;
};

let importLocations = function (pageId, locations) {
    locations = getLocation(locations);
    return db.cypher().match(`(org:Page:ImportTC {pageId: {pageId}})`)
        .optionalMatch(`(org)-[rel:HAS]->(:Address)`)
        .delete(`rel`)
        .with(`org`)
        .unwind(`{locations} AS location`)
        .merge(`(org)-[:HAS]->(address:Address {address: location.address, description: location.description,
                latitude: location.geo.latitude, longitude: location.geo.longitude})`)
        .onCreate(` SET address.addressId = location.addressId`)
        .end({pageId: pageId, locations: locations}).getCommand();
};

let importOrganization = function (organization) {
    organization.slogan = organization.slogan || null;
    organization.website = organization.website || null;
    return db.cypher().match(`(org:Page:ImportTC {pageId: {pageId}})`)
        .set(`org`, {
            title: organization.name, description: organization.description,
            slogan: organization.slogan, website: organization.website,
            topic: organization.categories, modified: time.getNowUtcTimestamp()
        })
        .end({pageId: organization.id, locations: organization.locations});
};

let importModifiedOrganization = async function (organization) {
    return await importOrganization(organization).send([
        importLocations(organization.id, organization.locations)
    ]);
};

module.exports = {
    import: importModifiedOrganization
};
