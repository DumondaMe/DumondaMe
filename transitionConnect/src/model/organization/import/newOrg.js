'use strict';

let db = requireDb();
let time = require('elyoos-server-lib').time;
let uuid = require('elyoos-server-lib').uuid;
let _ = require('lodash');

let getLocation = function (locations) {
    let newLocations = locations || [];
    for (let location of newLocations) {
        location.addressId = uuid.generateUUID();
    }
    return newLocations;
};

let existingUserAsAdmin = function (pageId, admins) {
    return db.cypher().match(`(org:Page:ImportTC {pageId: {pageId}}), (user:User)`)
        .where(`user.emailNormalized IN {admins}`)
        .merge(`(org)<-[:IS_ADMIN]-(user)`)
        .return(`collect(user.emailNormalized) AS admins`)
        .end({pageId: pageId, admins: admins});
};

let onlyTcUserAsAdmin = function (pageId, onlyTcUser) {
    return db.cypher().match(`(org:Page:ImportTC {pageId: {pageId}})`)
        .unwind(`{admins} AS admin`)
        .create(`(tcUser:TcUser {email: admin, emailNormalized: toLower(admin)})`)
        .merge(`(org)<-[:IS_ADMIN]-(tcUser)`)
        .end({pageId: pageId, admins: onlyTcUser});
};

let addLocations = function (pageId, locations) {
    return db.cypher().match(`(org:Page:ImportTC {pageId: {pageId}})`)
        .unwind(`{locations} AS location`)
        .merge(`(org)-[:HAS]->(address:Address {address: location.address, description: location.description,
                latitude: location.geo.latitude, longitude: location.geo.longitude})`)
        .onCreate(` SET address.addressId = location.addressId`)
        .end({pageId: pageId, locations: getLocation(locations)}).getCommand();
};

let importOrganization = function (pageId, organization) {
    let created = time.getNowUtcTimestamp();
    organization.slogan = organization.slogan || null;
    organization.website = organization.website || null;
    return db.cypher().create(`(org:Page:ImportTC {pageId: {pageId}})`)
        .set(`org`, {
            uuidTc: organization.uuid, title: organization.name, description: organization.description,
            slogan: organization.slogan, website: organization.website, label: 'Generic', language: ['de'],
            topic: organization.categories, created: created, modified: created
        })
        .end({pageId: pageId}).getCommand();
};

let importNewOrganization = async function (organization) {
    let pageId = uuid.generateUUID();
    let resp = await existingUserAsAdmin(pageId, organization.admins)
        .send([importOrganization(pageId, organization),
            addLocations(pageId, organization.locations)]);
    let onlyTcUser = _.difference(organization.admins, resp[2][0].admins);
    await onlyTcUserAsAdmin(pageId, onlyTcUser).send();
    return {id: pageId};
};

module.exports = {
    import: importNewOrganization
};
