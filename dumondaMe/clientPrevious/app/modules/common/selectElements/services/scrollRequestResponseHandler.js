'use strict';

module.exports = [function () {


    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.elements = previousOverview.concat(newOverview.elements);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.elements.length === requestedNumberOfElements;
    };
}];
