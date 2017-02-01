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

    this.getEditAddressMessage = function (addressId, address, description) {
        var result = {
            edit: {
                addressId: addressId,
                address: address.formatted,
                lat: address.geometry.lat,
                lng: address.geometry.lng
            }
        };

        if(angular.isString(description) && description.trim() !== "") {
            result.edit.description = description;
        }
        return result;
    };
}];
