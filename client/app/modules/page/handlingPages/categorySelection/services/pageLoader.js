'use strict';

module.exports = ['$q', 'PageDetail',
    function ($q, PageDetail) {
        var service = this;
        var pageDetails;
        //Only temporary
        var lastLabel = '';

        service.reset = function () {
            pageDetails = null;
        };

        service.load = function (label, pageId) {
            var deferred = $q.defer();
            pageDetails = PageDetail.get({pageId: pageId, label: label}, function () {
                lastLabel = label;
                deferred.resolve();
            });
            return deferred.promise;
        };

        service.getCategories = function () {
            var selected = {};
            selected[lastLabel] = true;
            return selected;
        };

        service.getTitle = function () {
            return pageDetails.page.title;
        };

        service.getLanguage = function () {
            return pageDetails.page.language;
        };

        service.getPageDetails = function () {
            return pageDetails.page;
        };
    }];
