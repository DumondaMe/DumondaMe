'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.contactingUsers = previousOverview.concat(newOverview.contactingUsers);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.contactingUsers.length === requestedNumberOfElements;
    };
}];
