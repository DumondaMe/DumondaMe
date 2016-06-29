'use strict';

var removePinwallElement = function (pinwall, elementToRemove, Observables, observables, observableFunctionName) {
    if (elementToRemove) {
        pinwall.splice(pinwall.indexOf(elementToRemove), 1);
        Observables.notifyObservables(observables, observableFunctionName);
    }
};


module.exports = ['Observables',
    function (Observables) {

        var observables = [], pinwall = [];

        this.register = function (name, observable) {
            Observables.register(observables, name, observable);
        };

        this.addPinwall = function (newPinwall) {
            pinwall = newPinwall;
        };

        this.removeBlog = function (blogId) {
            var elementToRemove = null;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    elementToRemove = pinwallElement;
                }
            });
            removePinwallElement(pinwall, elementToRemove, Observables, observables, 'removedBlog');
        };

        this.removeBlogRecommendation = function (recommendationId, blogId) {
            var elementToRemove = null;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Recommendation" && pinwallElement.label === 'Blog' &&
                    pinwallElement.recommendationId === recommendationId) {
                    elementToRemove = pinwallElement;
                }
                if(pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    pinwallElement.recommendedByUser = false;
                    pinwallElement.numberOfRecommendations--;
                }
            });
            removePinwallElement(pinwall, elementToRemove, Observables, observables, 'removedRecommendation');
        };

        this.addBlog = function (blog) {
            pinwall.unshift(blog);
            Observables.notifyObservables(observables, 'addedBlog');
        };

        this.addRecommendation = function (recommendation) {
            pinwall.unshift(recommendation);
            Observables.notifyObservables(observables, 'addedRecommendation');
        };
    }];
