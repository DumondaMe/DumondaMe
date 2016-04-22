'use strict';

var scrollRequest = {};

module.exports = ['$q', 'Home', 'PinwallBlogService', function ($q, Home, PinwallBlogService) {

    this.reset = function () {

        scrollRequest = {
            skipBlog: 0,
            skipRecommendation: 0,
            itemsPerPage: 30,
            requestPinwallElements: true,
            requestPinwallElementsRunning: false
        };
    };

    PinwallBlogService.register('PinwallBlogService', this);

    this.nextRequest = function (previousPinwall) {
        var deferred = $q.defer(), newPinwall;
        if (scrollRequest.requestPinwallElements && !scrollRequest.requestPinwallElementsRunning) {
            if (!previousPinwall) {
                previousPinwall = [];
            }
            scrollRequest.requestPinwallElementsRunning = true;
            newPinwall = Home.get({
                skipBlog: scrollRequest.skipBlog,
                skipRecommendation: scrollRequest.skipRecommendation,
                maxItems: scrollRequest.itemsPerPage
            }, function () {

                newPinwall.pinwall = previousPinwall.concat(newPinwall.pinwall);
                scrollRequest.requestPinwallElements = scrollRequest.skipBlog + scrollRequest.skipRecommendation + scrollRequest.itemsPerPage <=
                    newPinwall.skipBlog + newPinwall.skipRecommendation;
                scrollRequest.skipBlog = newPinwall.skipBlog;
                scrollRequest.skipRecommendation = newPinwall.skipRecommendation;
                scrollRequest.requestPinwallElementsRunning = false;
                deferred.resolve(newPinwall);
            }, function () {
                scrollRequest.requestPinwallElementsRunning = false;
                deferred.reject();
            });
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };

    this.removedBlog = function () {
        if (scrollRequest.skipBlog > 0) {
            scrollRequest.skipBlog = scrollRequest.skipBlog - 1;
        }
    };

    this.addedBlog = function () {
        scrollRequest.skipBlog = scrollRequest.skipBlog + 1;
    };
    
    this.addedRecommendation = function () {
        scrollRequest.skipRecommendation = scrollRequest.skipRecommendation + 1;
    };
}];
