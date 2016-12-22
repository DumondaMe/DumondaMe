'use strict';

module.exports = ['HomeScrollRequest',
    function (HomeScrollRequest) {

        this.removedPinwallElement = function (pinwall) {
            return HomeScrollRequest.removedPinwallElement().then(function (newPinwall) {
                pinwall.splice(0, pinwall.length); //Empty Array
                angular.forEach(newPinwall.pinwall, function (pinwallElement, index) {
                    pinwall[index] = pinwallElement;
                });
            });
        };

        this.addedBlog = function (blog, pinwall) {
            pinwall.unshift(blog);
            HomeScrollRequest.addedBlog();
        };

        this.addedRecommendation = function (recommendation, pinwall) {
            pinwall.unshift(recommendation);
            HomeScrollRequest.addedRecommendation();
        };
    }];
