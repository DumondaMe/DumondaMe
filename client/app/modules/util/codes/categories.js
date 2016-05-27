'use strict';

var categories = [{description: 'Gesundheit', code: 'health'},
    {description: 'Umwelt', code: 'environmental'},
    {description: 'Spiritualität', code: 'spiritual'},
    {description: 'Bildung', code: 'education'},
    {description: 'Persönliche Entwicklung', code: 'personalDevelopment'},
    {description: 'Politik', code: 'politics'},
    {description: 'Wirtschaft', code: 'economy'},
    {description: 'Gesellschaft', code: 'socialDevelopment'}];

module.exports = ['$log',
    function ($log) {
        var service = this;
        service.categories = categories;

        service.getCode = function (description) {
            var result = false;
            angular.forEach(categories, function (category) {
                if (category.description === description) {
                    result = category.code;
                }
            });
            return result;
        };

        service.getCategory = function (code) {
            var result = categories[0].description;
            angular.forEach(categories, function (category) {
                if (category.code === code) {
                    result = category.description;
                }
            });
            return result;
        };

        service.getCategories = function (codes) {
            var result = [];
            if (angular.isArray(codes)) {
                angular.forEach(codes, function (code) {
                    angular.forEach(categories, function (category) {
                        if (category.code === code) {
                            result.push(category);
                        }
                    });
                });
            }
            return result;
        };

        service.getCodes = function (categoriesToGetCodes) {
            var result = [];
            if (angular.isArray(categoriesToGetCodes)) {
                angular.forEach(categoriesToGetCodes, function (category) {
                    if (category.hasOwnProperty('code')) {
                        result.push(category.code);
                    } else {
                        $log.warn('property code does not exit!');
                    }
                });
            }
            return result;
        };

        service.getCategoryClass = function (category) {
            var categoryClass = {};
            categoryClass[category] = true;
            return categoryClass;
        };
    }];
