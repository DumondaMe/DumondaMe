'use strict';

let db = requireDb();
let security = require('./../securityAddress');
let time = require('elyoos-server-lib').time;

let editAddress = function (userId, params, req) {
    return security.checkAllowedToEditAddress(params, userId, req).then(function () {
        return db.cypher().match("(page:Page)-[:HAS]->(address:Address {addressId: {addressId}})")
            .set('address', {address: params.address, description: params.description, latitude: params.latitude, longitude: params.longitude})
            .set('page', {modifiedAddress: time.getNowUtcTimestamp()})
            .end(params).send();
    }).then(function () {
        return {};
    });
};

module.exports = {
    editAddress: editAddress
};
