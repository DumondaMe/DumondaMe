'use strict';

module.exports = [function () {

    this.getCreateAddressMessage = function (pageId, address, description) {
        return {
            create: {
                genericPageId: pageId,
                description: description,
                address: address.formatted,
                lat: address.geometry.lat,
                lng: address.geometry.lng
            }
        };
    };

    this.getModifyAddressMessage = function (data) {
        return {};
    };
}];
