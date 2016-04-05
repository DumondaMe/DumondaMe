'use strict';

var heightCalculator = {
    Blog: function (blog) {
        blog.pinwallHeight = 170;
        if (blog.hasOwnProperty('heightPreviewImage')) {
            blog.pinwallHeight += blog.heightPreviewImage;
        }
    },
    Recommendation: function (recommendation) {
        recommendation.pinwallHeight = 315;
    }
};

module.exports = [
    function () {

        this.calculator = heightCalculator;

        this.setHeightPinwallElements = function (pinwall) {
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.hasOwnProperty('pinwallType')) {
                    if (heightCalculator[pinwallElement.pinwallType]) {
                        heightCalculator[pinwallElement.pinwallType](pinwallElement);
                    }
                }
            });
        };
    }];
