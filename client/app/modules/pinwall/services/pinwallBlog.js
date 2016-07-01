'use strict';

var removePinwallElement = function ($q, pinwall, elementToRemove, requestService) {
    if (elementToRemove) {
        return requestService.removedPinwallElement().then(function (newPinwall) {
            pinwall.length = 0;
            angular.forEach(newPinwall.pinwall, function (pinwallElement, index) {
                pinwall[index] = pinwallElement;
            });
        });
    }
    return $q.reject();
};


module.exports = ['$q',
    function ($q) {
        var requestService = {}, pinwall = [];

        this.registerRequestService = function (newRequestService) {
            requestService = newRequestService;
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
            return removePinwallElement($q, pinwall, elementToRemove, requestService);
        };

        this.removeBlogRecommendation = function (recommendationId, blogId) {
            var elementToRemove = null;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Recommendation" && pinwallElement.label === 'Blog' &&
                    pinwallElement.userRecommendationId === recommendationId) {
                    elementToRemove = pinwallElement;
                }
                if (pinwallElement.pinwallType === "Blog" && pinwallElement.blogId === blogId) {
                    pinwallElement.recommendedByUser = false;
                    pinwallElement.numberOfRecommendations--;
                }
            });
            return removePinwallElement($q, pinwall, elementToRemove, requestService);
        };

        this.removeRecommendation = function (recommendationId) {
            var elementToRemove = null;
            angular.forEach(pinwall, function (pinwallElement) {
                if (pinwallElement.pinwallType === "Recommendation" && pinwallElement.label !== 'Blog' &&
                    pinwallElement.userRecommendationId === recommendationId) {
                    elementToRemove = pinwallElement;
                }
            });
            return removePinwallElement($q, pinwall, elementToRemove, requestService);
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
