'use strict';

module.exports = ['OverviewNews', 'dateFormatter', function (OverviewNews, dateFormatter) {
    var ctrl = this;

    ctrl.getTime = dateFormatter.getTime;

    ctrl.overview = OverviewNews.get({skip: 0, maxItems: 10});
}];
