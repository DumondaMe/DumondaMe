'use strict';

var recommendationTypes = [{description: 'Blog', code: 'Blog'},
    {description: 'Buch', code: 'Book'},
    {description: 'Youtube', code: 'Youtube'},
    {description: 'Link', code: 'Link'}];

module.exports = ['$log',
    function ($log) {
        var service = this;
        service.recommendationTypes = recommendationTypes;

        service.getCodes = function (typesToGetCodes) {
            var result = [];
            if (angular.isArray(typesToGetCodes)) {
                angular.forEach(typesToGetCodes, function (type) {
                    if (type.hasOwnProperty('code')) {
                        result.push(type.code);
                    } else {
                        $log.warn('property code does not exit!');
                    }
                });
            }
            return result;
        };

        service.getRecommendationType = function (code) {
            var result = recommendationTypes[0].description;
            angular.forEach(recommendationTypes, function (recommendationType) {
                if (recommendationType.code === code) {
                    result = recommendationType.description;
                }
            });
            return result;
        };
    }];
