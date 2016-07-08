'use strict';


module.exports = [
    function () {

        var service = this;

        service.isValidTopicSelected = function (selectedTopics) {
            return angular.isArray(selectedTopics) && selectedTopics.length > 0;
        };

        service.isSendBlogAllowed = function (blogText, blogTitle, selectedTopics, selectedLanguage, imageLoading) {
            if (!imageLoading && angular.isString(blogText) && angular.isString(blogTitle) && service.isValidTopicSelected(selectedTopics) &&
                angular.isObject(selectedLanguage) && selectedLanguage.hasOwnProperty('code')) {
                return blogText.trim() !== '' && blogTitle.trim() !== '';
            }
            return false;
        };
    }];
