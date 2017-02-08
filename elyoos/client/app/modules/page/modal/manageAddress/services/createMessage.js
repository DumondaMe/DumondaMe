'use strict';

module.exports = [function () {

    var setDescription = function (message, description) {
        if(angular.isString(description) && description.trim() !== "") {
            message.description = description;
        }
    };

    this.getCreateAddressMessage = function (pageId, address, description) {
        var result = {
            create: {
                genericPageId: pageId,
                description: description,
                address: address.address,
                latitude: address.latitude,
                longitude: address.longitude
            }
        };
        setDescription(result.create, description);
        return result;
    };

    this.getEditAddressMessage = function (addressId, address, description) {
        var result = {
            edit: {
                addressId: addressId,
                address: address.address,
                latitude: address.latitude,
                longitude: address.longitude
            }
        };
        setDescription(result.edit, description);
        return result;
    };
}];
