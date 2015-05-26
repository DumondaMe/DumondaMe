'use strict';

var categories = {
    BookPage: {description: 'Buch'},
    VideoPage: {
        description: 'Video',
        subCategory: {
            Movie: {description: 'Film'},
            Youtube: {description: 'Youtube Video'}
        }
    }
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

        this.getSubCategories = function (subCategory) {
            var key, subKey, collection = [];
            for (key in categories) {
                if (categories.hasOwnProperty(key)) {
                    if (categories[key].description === subCategory) {
                        for (subKey in categories[key].subCategory) {
                            if (categories[key].subCategory.hasOwnProperty(subKey)) {
                                collection.push(categories[key].subCategory[subKey].description);
                            }
                        }
                    }
                }
            }
            return collection;
        };

        this.getPageType = function (description) {
            var result = false, key, subKey;

            for (key in categories) {
                if (categories[key].description === description) {
                    result = key;
                } else if (categories[key].subCategory) {
                    for (subKey in categories[key].subCategory) {
                        if (categories[key].subCategory[subKey].description === description) {
                            result = subKey;
                        }
                    }
                }
            }
            return result;
        };
    }];
