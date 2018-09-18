'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.user = previousOverview.concat(newOverview.user);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.user.length === requestedNumberOfElements;
    };
}];
