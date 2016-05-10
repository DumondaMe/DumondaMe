'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.question = previousOverview.concat(newOverview.question);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.question.length === requestedNumberOfElements;
    };
}];
