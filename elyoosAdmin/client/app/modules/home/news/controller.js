'use strict';

module.exports = ['OverviewNews', 'dateFormatter', 'ScrollRequest', 'OverviewNewsScrollRequestResponseHandler',
    'ElyModal',
    function (OverviewNews, dateFormatter, ScrollRequest, OverviewNewsScrollRequestResponseHandler, ElyModal) {
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

        ctrl.createNews = function () {
            ElyModal.show('CreateNewsCtrl', 'app/modules/home/news/modal/createNews/template.html',
                {}).then(function (resp) {

            });
        };
    }];
