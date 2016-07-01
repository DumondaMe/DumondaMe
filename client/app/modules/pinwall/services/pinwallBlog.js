'use strict';

module.exports = [
    function () {
        var requestService = {}, pinwall = [];

        this.registerRequestService = function (newRequestService) {
            requestService = newRequestService;
        };

        this.addPinwall = function (newPinwall) {
            pinwall = newPinwall;
        };

        this.removePinwallElement = function () {
            return requestService.removedPinwallElement().then(function (newPinwall) {
                pinwall.length = 0;
                angular.forEach(newPinwall.pinwall, function (pinwallElement, index) {
                    pinwall[index] = pinwallElement;
                });
            });
        };

        this.addBlog = function (blog) {
            pinwall.unshift(blog);
            requestService.addedBlog();
        };

        this.addRecommendation = function (recommendation) {
            pinwall.unshift(recommendation);
            requestService.addedRecommendation();
        };
    }];
