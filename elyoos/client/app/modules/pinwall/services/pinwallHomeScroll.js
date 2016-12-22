'use strict';

module.exports = ['HomeScrollRequest',
    function (HomeScrollRequest) {
        var pinwall = [];

        this.addPinwall = function (newPinwall) {
            pinwall = newPinwall;
        };

        this.removePinwallElement = function () {
            return HomeScrollRequest.removedPinwallElement().then(function (newPinwall) {
                pinwall.splice(0,pinwall.length); //Empty Array
                angular.forEach(newPinwall.pinwall, function (pinwallElement, index) {
                    pinwall[index] = pinwallElement;
                });
            });
        };

        this.addBlog = function (blog) {
            pinwall.unshift(blog);
            HomeScrollRequest.addedBlog();
        };

        this.addRecommendation = function (recommendation) {
            pinwall.unshift(recommendation);
            HomeScrollRequest.addedRecommendation();
        };
    }];
