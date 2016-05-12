'use strict';

var validSelectedCategories = function (selectedCategories) {
    return angular.isArray(selectedCategories) && selectedCategories.length > 0;
};

var validSelectedLanguages = function (selectedLanguages) {
    return angular.isArray(selectedLanguages) && selectedLanguages.length === 1;
};

module.exports = [
    function () {

        this.isSendQuestionAllowed = function (text, selectedCategories, selectedLanguages) {
            if (text && validSelectedCategories(selectedCategories) && validSelectedLanguages(selectedLanguages)) {
                return text.trim() !== '';
            }
            return false;
        };
    }];
