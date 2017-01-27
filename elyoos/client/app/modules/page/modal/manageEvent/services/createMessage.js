'use strict';

var setAddress = function (message, data) {
    if (data.selectedAddress.hasOwnProperty('addressId')) {
        message.existingAddressId = data.selectedAddress.addressId;
    } else {
        message.address = {
            description: data.selectedAddress.formatted,
            lat: data.selectedAddress.geometry.lat,
            lng: data.selectedAddress.geometry.lng
        };
    }
};

module.exports = [function () {

    this.getCreateEventMessage = function (data, genericPageId) {
        var message = {
            title: data.title,
            description: data.description,
            genericPageId: genericPageId,
            startDate: Math.floor(data.startDate.valueOf() / 1000),
            endDate: Math.floor(data.endDate.valueOf() / 1000)
        };
        setAddress(message, data);
        return message;
    };

    this.getModifyEventMessage = function (data) {
        return {};
    };
}];
