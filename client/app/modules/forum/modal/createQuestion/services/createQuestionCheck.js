'use strict';

var validSelectedTopics = function (selectedTopics) {
    return angular.isArray(selectedTopics) && selectedTopics.length > 0;
};

var validSelectedLanguages = function (selectedLanguages) {
    return angular.isArray(selectedLanguages) && selectedLanguages.length === 1;
};

module.exports = [
    function () {

        this.isSendQuestionAllowed = function (text, selectedTopics, selectedLanguages) {
            if (text && validSelectedTopics(selectedTopics) && validSelectedLanguages(selectedLanguages)) {
                return text.trim() !== '';
            }
            return false;
        };
    }];
