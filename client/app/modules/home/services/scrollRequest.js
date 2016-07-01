'use strict';

var scrollRequest = {};

module.exports = ['$q', 'Home', 'PinwallBlogService', function ($q, Home, PinwallBlogService) {

    this.reset = function () {
        scrollRequest = {
            skipBlog: 0,
            skipRecommendation: 0,
            itemsPerPage: 15,
            requestPinwallElements: true,
            requestPinwallElementsRunning: false
        };
        PinwallBlogService.registerRequestService(this);
    };

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

    this.removedPinwallElement = function () {
        var deferred = $q.defer(), numberOfItemsToUpdate, newPinwall;
        numberOfItemsToUpdate = scrollRequest.skipBlog + scrollRequest.skipRecommendation;
        if (numberOfItemsToUpdate > 200) {
            numberOfItemsToUpdate = 200;
        }
        newPinwall = Home.get({
            skipBlog: 0,
            skipRecommendation: 0,
            maxItems: numberOfItemsToUpdate
        }, function (resp) {
            scrollRequest.skipBlog = resp.skipBlog;
            scrollRequest.skipRecommendation = resp.skipRecommendation;
            deferred.resolve(newPinwall);
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    this.addedBlog = function () {
        scrollRequest.skipBlog = scrollRequest.skipBlog + 1;
    };

    this.addedRecommendation = function () {
        scrollRequest.skipRecommendation = scrollRequest.skipRecommendation + 1;
    };
}];
