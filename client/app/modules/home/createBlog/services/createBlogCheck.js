'use strict';


module.exports = [
    function () {

        var service = this;

        service.isValidCategorySelected = function (selectedCategories) {
            return angular.isArray(selectedCategories) && selectedCategories.length > 0;
        };

        service.isSendBlogAllowed = function (blogText, selectedCategories, imageLoading) {
            if (!imageLoading && blogText && service.isValidCategorySelected(selectedCategories)) {
                return blogText.trim() !== '';
            }
            return false;
        };
    }];
