'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.feedback = previousOverview.concat(newOverview.feedback);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.feedback.length === requestedNumberOfElements;
    };
}];
