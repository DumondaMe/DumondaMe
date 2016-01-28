'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.contacts = previousOverview.concat(newOverview.contacts);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.contacts.length === requestedNumberOfElements;
    };
}];
