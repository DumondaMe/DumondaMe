'use strict';

var skip,
    itemsPerPage,
    requestPinwallElements,
    requestPinwallElementsRunning;

var checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
    return pinwall.length === requestedNumberOfElements;
};

module.exports = ['$q', 'moment', 'Home', 'HomePinwallElements',
    function ($q, moment, Home, HomePinwallElements) {

        this.resetCache = function () {
            skip = 0;
            itemsPerPage = 10;
            //HomePinwallElements.reset();
            requestPinwallElements = true;
            requestPinwallElementsRunning = false;
        }();

        /*        this.resetCache();*/

        this.requestPinwall = function (previousPinwall) {
            var deferred = $q.defer(), newPinwall;
            if (requestPinwallElements && !requestPinwallElementsRunning) {
                if (!previousPinwall) {
                    previousPinwall = [];
                }
                requestPinwallElementsRunning = true;
                newPinwall = Home.get({maxItems: itemsPerPage, skip: skip}, function () {

                    newPinwall.pinwall = previousPinwall.concat(newPinwall.pinwall);
                    //var tempPinwall = HomePinwallElements.setPinwallElements(newPinwall);

                    requestPinwallElements = checkRequestPinwall(newPinwall.pinwall, skip);
                    requestPinwallElementsRunning = false;
                    deferred.resolve(newPinwall);
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
