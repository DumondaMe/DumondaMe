'use strict';

var skip = 0,
    itemsPerPage = 30,
    requestPinwallElements = true,
    requestPinwallElementsRunning = false;

var checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
    return pinwall.length === requestedNumberOfElements;
};

module.exports = ['$q', 'moment', 'Home',
    function ($q, moment, Home) {

        this.requestPinwall = function (previousPinwall) {
            var deferred = $q.defer(), newPinwall;
            if (requestPinwallElements && !requestPinwallElementsRunning) {
                if (!previousPinwall) {
                    previousPinwall = [];
                }
                requestPinwallElementsRunning = true;
                newPinwall = Home.get({maxItems: itemsPerPage, skip: skip}, function () {

                    newPinwall.pinwall = previousPinwall.concat(newPinwall.pinwall);

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
