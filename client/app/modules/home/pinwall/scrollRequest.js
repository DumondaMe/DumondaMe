'use strict';

var scrollRequests = {};

module.exports = ['$q', function ($q) {

    this.reset = function (serviceName, requestService, responseHandler) {

        scrollRequests[serviceName] = {
            request: requestService,
            responseHandler: responseHandler,
            skip: 0,
            itemsPerPage: 5,
            requestPinwallElements: true,
            requestPinwallElementsRunning: false
        };
    };

    this.nextRequest = function (serviceName, previousPinwall) {
        var deferred = $q.defer(), newPinwall, scrollRequest = scrollRequests[serviceName];
        if (scrollRequest.requestPinwallElements && !scrollRequest.requestPinwallElementsRunning) {
            if (!previousPinwall) {
                previousPinwall = [];
            }
            scrollRequest.requestPinwallElementsRunning = true;
            newPinwall = scrollRequest.request({
                maxItems: scrollRequest.itemsPerPage,
                skip: scrollRequest.skip
            }, function () {

                scrollRequest.responseHandler.handlingResponse(newPinwall, previousPinwall);
                scrollRequest.requestPinwallElements = scrollRequest.responseHandler.checkRequestPinwall(newPinwall, scrollRequest.skip);
                scrollRequest.requestPinwallElementsRunning = false;
                deferred.resolve(newPinwall);
            }, function () {
                scrollRequest.requestPinwallElementsRunning = false;
                deferred.reject();
            });
            scrollRequest.skip += scrollRequest.itemsPerPage;
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };

    this.removedElement = function (serviceName) {
        if (scrollRequests[serviceName].skip > 0) {
            scrollRequests[serviceName].skip = scrollRequests[serviceName].skip - 1;
        }
    };

    this.addedElement = function (serviceName) {
        scrollRequests[serviceName].skip = scrollRequests[serviceName].skip + 1;
    };
}];
