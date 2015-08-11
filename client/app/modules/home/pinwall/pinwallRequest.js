'use strict';

var skip,
    itemsPerPage,
    timestamp,
    requestPinwallElements,
    requestPinwallElementsRunning;

var checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
    function countElements(pinwallElements, type) {
        var count = 0;
        angular.forEach(pinwallElements, function (pinwallElement) {
            if (pinwallElement.type === type) {
                count++;
            }
        });
        return count;
    }

    return !(countElements(pinwall, 'Blog') < requestedNumberOfElements &&
    countElements(pinwall, 'Recommendation') < requestedNumberOfElements );
};

module.exports = ['$q', 'moment', 'Home', 'HomePinwallElements',
    function ($q, moment, Home, HomePinwallElements) {

        this.resetCache = function () {
            timestamp = Math.floor(moment.utc().valueOf() / 1000);
            skip = 0;
            itemsPerPage = 30;
            HomePinwallElements.reset();
            requestPinwallElements = true;
            requestPinwallElementsRunning = false;
        };

        this.resetCache();

        this.requestPinwall = function () {
            var deferred = $q.defer(), newPinwall;
            if (requestPinwallElements && !requestPinwallElementsRunning) {
                requestPinwallElementsRunning = true;
                newPinwall = Home.get({maxItems: itemsPerPage, skip: skip, timestamp: timestamp}, function () {

                    var tempPinwall = HomePinwallElements.setPinwallElements(newPinwall);

                    requestPinwallElements = checkRequestPinwall(tempPinwall, itemsPerPage);
                    requestPinwallElementsRunning = false;
                    deferred.resolve({});
                }, function () {
                    requestPinwallElementsRunning = false;
                    deferred.reject();
                });
                skip += itemsPerPage;
            } else {
                deferred.reject();
            }
            return deferred.promise;
        };
    }];
