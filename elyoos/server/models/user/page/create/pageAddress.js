'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let security = require('./../securityAddress');

let createAddress = function (userId, params, req) {
    params.addressId = uuid.generateUUID();
    params.created = time.getNowUtcTimestamp();
    params.description = params.description || null;
    return security.checkAllowedToAddAddress(params, userId, req).then(function () {
        return db.cypher().match("(page:Page {pageId: {genericPageId}, label: 'Generic'})")
            .createUnique(`(page)-[:HAS]->(address:Address {address: {address},  description: {description}, 
                            latitude: toFloat({lat}), longitude: toFloat({lng}), addressId: {addressId}})`)
            .end(params).send();
    }).then(function () {
        return {addressId: params.addressId};
    });
};

module.exports = {
    createAddress: createAddress,
};
