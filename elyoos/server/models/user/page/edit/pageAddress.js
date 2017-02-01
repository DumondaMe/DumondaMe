'use strict';

let db = requireDb();
let security = require('./../securityAddress');
let time = require('elyoos-server-lib').time;

let editAddress = function (userId, params, req) {
    params.modified = time.getNowUtcTimestamp();
    return security.checkAllowedToEditAddress(params, userId, req).then(function () {
        return db.cypher().match("(address:Address {addressId: {addressId}})")
            .set('address', {address: params.address, description: params.description, latitude: params.lat, longitude: params.lng})
            .end(params).send();
    }).then(function () {
        return {};
    });
};

module.exports = {
    editAddress: editAddress
};
