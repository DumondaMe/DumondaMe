'use strict';

module.exports = [function () {

    this.addSourceDescription = function (addresses, description) {
        addresses.forEach(function (address) {
            address.sourceImportDescription = description;
        });
    };
}];
