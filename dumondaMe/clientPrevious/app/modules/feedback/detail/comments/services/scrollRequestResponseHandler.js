'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.comments = previousOverview.concat(newOverview.comments);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.comments.length === requestedNumberOfElements;
    };
}];
