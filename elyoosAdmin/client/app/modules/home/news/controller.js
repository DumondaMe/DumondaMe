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

        ctrl.editNews = function (news) {
            ElyModal.show('EditNewsCtrl', 'app/modules/home/news/modal/editNews/template.html',
                {title: news.title, modified: news.modified, text: news.text, newsId: news.newsId}).then(function (resp) {
                ctrl.overviewNews.news.forEach(function (newsElement) {
                    if (newsElement.newsId === resp.newsId) {
                        newsElement.title = resp.title;
                        newsElement.text = resp.text;
                        newsElement.modified = resp.modified;
                    }
                });
            });
        };
    }];
