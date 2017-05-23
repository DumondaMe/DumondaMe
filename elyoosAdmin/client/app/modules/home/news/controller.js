'use strict';

module.exports = ['OverviewNews', 'dateFormatter', 'ScrollRequest', 'OverviewNewsScrollRequestResponseHandler',
    function (OverviewNews, dateFormatter, ScrollRequest, OverviewNewsScrollRequestResponseHandler) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.getTime;

        ctrl.overviewNews = {news: []};

        ScrollRequest.reset('OverviewNews', OverviewNews.get, OverviewNewsScrollRequestResponseHandler);

        ctrl.nextNews = function () {
            ScrollRequest.nextRequest('OverviewNews', ctrl.overviewNews.news).then(function (news) {
                ctrl.overviewNews = news;
            });
        };
        ctrl.nextNews();
    }];
