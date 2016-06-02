'use strict';


module.exports = [
    function () {

        var service = this;

        service.isValidTopicSelected = function (selectedTopics) {
            return angular.isArray(selectedTopics) && selectedTopics.length > 0;
        };

        service.isSendBlogAllowed = function (blogText, selectedTopics, imageLoading) {
            if (!imageLoading && blogText && service.isValidTopicSelected(selectedTopics)) {
                return blogText.trim() !== '';
            }
            return false;
        };
    }];
