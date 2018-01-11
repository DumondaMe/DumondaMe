'use strict';

let uuid = require('elyoos-server-lib').uuid;

let addPlaceElements = function (params) {
    params.addressId = uuid.generateUUID();
    params.addressDescription = params.address.description || null;
    params.addressAddress = params.address.address;
    params.addressLat = params.address.latitude;
    params.addressLng = params.address.longitude;
};

module.exports = {
    addPlaceElements: addPlaceElements
};
