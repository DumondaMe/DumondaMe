'use strict';

module.exports = [function () {

    this.handlingResponse = function (newOverview, previousOverview) {
        newOverview.news = previousOverview.concat(newOverview.news);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.news.length === requestedNumberOfElements;
    };
}];
