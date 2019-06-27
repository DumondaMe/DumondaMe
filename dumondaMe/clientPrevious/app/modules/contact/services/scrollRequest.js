'use strict';

module.exports = ['$q', 'ContactRecommendation', function ($q, ContactRecommendation) {

    var scrollRequest = {};

    this.reset = function () {
        scrollRequest = {
            skipInvitedUser: 0,
            skipRecommendedByContact: 0,
            skipRecommended: 0,
            itemsPerType: 25,
            requestPinwallElements: true,
            requestPinwallElementsRunning: false
        };
    };

    this.nextRequest = function (previousPinwall) {
        var deferred = $q.defer(), newPinwall;
        if (scrollRequest.requestPinwallElements && !scrollRequest.requestPinwallElementsRunning) {
            if (!previousPinwall) {
                previousPinwall = [];
            }
            scrollRequest.requestPinwallElementsRunning = true;
            newPinwall = ContactRecommendation.get({
                    skipInvitedUser: scrollRequest.skipInvitedUser,
                    skipRecommendedByContact: scrollRequest.skipRecommendedByContact,
                    skipRecommended: scrollRequest.skipRecommended,
                    maxItemsPerType: scrollRequest.itemsPerType
                }, function () {
                    newPinwall.recommendedUser = previousPinwall.concat(newPinwall.recommendedUser);
                    scrollRequest.requestPinwallElements =
                        scrollRequest.skipInvitedUser + scrollRequest.itemsPerType === newPinwall.skipInvitedUser ||
                        scrollRequest.skipRecommendedByContact + scrollRequest.itemsPerType === newPinwall.skipRecommendedByContact ||
                        scrollRequest.skipRecommended + scrollRequest.itemsPerType === newPinwall.skipRecommended;
                    scrollRequest.skipInvitedUser = newPinwall.skipInvitedUser;
                    scrollRequest.skipRecommendedByContact = newPinwall.skipRecommendedByContact;
                    scrollRequest.skipRecommended = newPinwall.skipRecommended;
                    scrollRequest.requestPinwallElementsRunning = false;
                    deferred.resolve(newPinwall);
                }, function () {
                    scrollRequest.requestPinwallElementsRunning = false;
                    deferred.reject();
                }
            );
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };
}];
