'use strict';

var categories = [{description: 'Gesundheit', code: 'health'},
    {description: 'Umwelt', code: 'environmental'},
    {description: 'Spiritualität', code: 'spiritual'},
    {description: 'Bildung', code: 'education'},
    {description: 'Persönliche Entwicklung', code: 'personalDevelopment'},
    {description: 'Gesellschaftliche Entwicklung', code: 'socialDevelopment'}];

module.exports = [
    function () {
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

        service.getCategoryClass = function (category) {
            var categoryClass = {};
            categoryClass[category] = true;
            return categoryClass;
        };
    }];
