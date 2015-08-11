'use strict';

var setMessageContacting = function (element, collectionName) {
    element.pinwallHeight = 41;
    element.pinwallHeight += element[collectionName].length * 52;
};

var heightCalculator = {
    Blog: function (blog) {
        blog.pinwallHeight = 170;
        if (blog.hasOwnProperty('heightPreviewImage')) {
            blog.pinwallHeight += blog.heightPreviewImage;
        }
    },
    Recommendation: function (recommendation) {
        recommendation.pinwallHeight = 325;
    },
    NewMessages: function (newMessage) {
        setMessageContacting(newMessage, 'messages');
    },
    Contacting: function (contacting) {
        setMessageContacting(contacting, 'contacting');
    }
};

module.exports = [
    function () {

        this.calculator = heightCalculator;

        this.setHeightPinwallElements = function (pinwall) {
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.hasOwnProperty('type')) {
                    if (heightCalculator[pinwallElement.type]) {
                        heightCalculator[pinwallElement.type](pinwallElement);
                    }
                }
            });
        };
    }];
