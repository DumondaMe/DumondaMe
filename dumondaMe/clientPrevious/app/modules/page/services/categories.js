'use strict';

var categories = {
    Book: {description: 'Buch'},
    Youtube: {description: 'Youtube'},
    Link: {description: 'Link'}
};

module.exports = [
    function () {
        this.categories = categories;

        this.getCategories = function () {
            var key, collection = [];
            for (key in categories) {
                if (categories.hasOwnProperty(key)) {
                    collection.push(categories[key].description);
                }
            }
            return collection;
        };

        this.getPageType = function (description) {
            var result = false, key;

            for (key in categories) {
                if (categories[key].description === description) {
                    result = key;
                }
            }
            return result;
        };
    }];
