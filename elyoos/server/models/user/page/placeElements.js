'use strict';

let uuid = require('elyoos-server-lib').uuid;

let addPlaceElements = function (params) {
    params.addressId = uuid.generateUUID();
    params.addressDescription = params.address.description;
    params.addressLat = params.address.lat;
    params.addressLng = params.address.lng;
};

module.exports = {
    addPlaceElements: addPlaceElements
};
