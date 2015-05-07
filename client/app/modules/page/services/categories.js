'use strict';

var categories = {
    BookPage: 'Buch',
    VideoPage: 'Video'
};

module.exports = [
    function () {
        this.categories = categories;

        this.getCategories = function () {
            var key, collection = [];
            for (key in categories) {
                if (categories.hasOwnProperty(key)) {
                    collection.push(categories[key]);
                }
            }
            return collection;
        };

        this.getPageType = function (description) {
            var result = false, key;

            for (key in categories) {
                if (categories[key] === description) {
                    result = key;
                }
            }
            return result;
        };
    }];
