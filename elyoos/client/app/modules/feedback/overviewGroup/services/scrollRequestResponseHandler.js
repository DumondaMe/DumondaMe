'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.feedbacks = previousOverview.concat(newOverview.feedbacks);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.feedbacks.length === requestedNumberOfElements;
    };
}];
