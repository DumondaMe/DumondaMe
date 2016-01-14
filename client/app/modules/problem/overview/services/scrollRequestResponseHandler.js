'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.problems = previousOverview.concat(newOverview.problems);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.problems.length === requestedNumberOfElements;
    };
}];
