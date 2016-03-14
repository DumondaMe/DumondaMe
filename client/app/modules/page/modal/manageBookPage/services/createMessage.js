'use strict';

var getCategories = function (selectedCategories) {
    var categories = [];
    angular.forEach(selectedCategories, function (category) {
        categories.push(category.code);
    });
    return categories;
};

module.exports = ['DateConverter', function (DateConverter) {

    this.getCreateBookPageMessage = function (data) {
        return {
            bookPage: {
                title: data.title,
                description: data.description,
                author: data.author,
                publishDate: DateConverter.convertDisplayToInteger(data.publishDate),
                category: getCategories(data.selectedCategories)
            }
        };
    };
}];
