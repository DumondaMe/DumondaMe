'use strict';

module.exports = ['$q',
    function ($q) {
        var pinwall = [], service = null;

        this.setPinwall = function (newPinwall) {
            pinwall = newPinwall;
        };

        this.setService = function (newService) {
            service = newService;
        };

        this.removePinwallElement = function () {
            var deferred = $q.defer();
            if(angular.isObject(service) && pinwall && pinwall.length > 0) {
                return service.removedPinwallElement(pinwall);
            }
            deferred.resolve();
            return deferred;
        };

        this.addBlog = function (blog) {
            if(angular.isObject(service)) {
                service.addedBlog(blog, pinwall);
            }
        };

        this.addRecommendation = function (recommendation) {
            if(angular.isObject(service)) {
                service.addedRecommendation(recommendation, pinwall);
            }
        };
    }];
